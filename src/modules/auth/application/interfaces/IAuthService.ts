import type { LoginDTO } from '../dtos/LoginDTO';
import type { AuthUserDTO } from '../dtos/AuthUserDTO';

export interface IAuthService {
  login(dto: LoginDTO): Promise<{ token: string; user: AuthUserDTO }>;
  verifyToken(token: string): Promise<AuthUserDTO>;
}
