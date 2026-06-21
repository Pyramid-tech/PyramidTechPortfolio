import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AuthService, COOKIE_NAME } from '../../application/services/AuthService';
import { AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import { loginSchema } from '../schemas/authSchema';
import { HttpError } from '@/shared/errors/HttpError';
import { logger } from '@/shared/logger';

const authService = new AuthService(new AuthRepository(), logger);

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
};

export class AuthController {
  static async login(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const parsed = loginSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
      }

      const { token, user } = await authService.login(parsed.data);

      const response = NextResponse.json({ user });
      response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
      return response;
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json({ message: error.message }, { status: error.statusCode });
      }
      logger.error('POST /api/auth/login unexpected error', { error: String(error) });
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }

  static async logout(): Promise<NextResponse> {
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.set(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
    return response;
  }

  static async me(req: NextRequest): Promise<NextResponse> {
    try {
      const token = req.cookies.get(COOKIE_NAME)?.value;
      if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

      const user = await authService.verifyToken(token);
      return NextResponse.json({ user });
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json({ message: error.message }, { status: error.statusCode });
      }
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
}
