import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

import { HttpError } from '@/shared/errors/HttpError';
import type { IAuthRepository } from '../../infrastructure/interfaces/IAuthRepository';
import type { IAuthService } from '../interfaces/IAuthService';
import type { LoginDTO } from '../dtos/LoginDTO';
import type { AuthUserDTO } from '../dtos/AuthUserDTO';
import type { ILogger } from '@/shared/logger/interfaces/ILogger';

const JWT_EXPIRY = '7d';
const COOKIE_NAME = 'pyramid_token';

export { COOKIE_NAME };

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return new TextEncoder().encode(secret);
}

export class AuthService implements IAuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly logger: ILogger,
  ) {}

  async login(dto: LoginDTO): Promise<{ token: string; user: AuthUserDTO }> {
    const member = await this.authRepository.findByEmail(dto.email);

    if (!member || !member.password) {
      this.logger.warning('Login failed: email not found or no password set', { email: dto.email });
      throw new HttpError(401, 'Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, member.password);
    if (!valid) {
      this.logger.warning('Login failed: wrong password', { email: dto.email });
      throw new HttpError(401, 'Invalid credentials');
    }

    const user: AuthUserDTO = {
      id: member.id,
      name: member.name,
      email: member.email,
      jobTitle: member.jobTitle,
    };

    const token = await new SignJWT({ ...user })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRY)
      .sign(getSecret());

    this.logger.info('Login successful', { email: dto.email });
    return { token, user };
  }

  async verifyToken(token: string): Promise<AuthUserDTO> {
    try {
      const { payload } = await jwtVerify(token, getSecret());
      return {
        id: payload.id as string,
        name: payload.name as string,
        email: payload.email as string,
        jobTitle: payload.jobTitle as string,
      };
    } catch {
      throw new HttpError(401, 'Invalid or expired token');
    }
  }
}
