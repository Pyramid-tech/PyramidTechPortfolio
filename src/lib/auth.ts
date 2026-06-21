import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { pyramidTeam } from '@/lib/db/schema/team';
import type { AuthUserDTO } from '@/types/auth';

export const COOKIE_NAME = 'pyramid_token';
const JWT_EXPIRY = '7d';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
};

export class AuthError extends Error {
  constructor(message = 'Invalid credentials') {
    super(message);
    this.name = 'AuthError';
  }
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return new TextEncoder().encode(secret);
}

async function signToken(user: AuthUserDTO): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(getSecret());
}

/** Verify email + password, returning the user and a freshly signed JWT. */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<{ token: string; user: AuthUserDTO }> {
  const rows = await db.select().from(pyramidTeam).where(eq(pyramidTeam.email, email)).limit(1);
  const member = rows[0];
  if (!member || !member.password) throw new AuthError();

  const valid = await bcrypt.compare(password, member.password);
  if (!valid) throw new AuthError();

  const user: AuthUserDTO = {
    id: member.id,
    name: member.name,
    email: member.email,
    jobTitle: member.jobTitle,
  };
  return { token: await signToken(user), user };
}

/** Current authenticated user from the session cookie, or null. Safe in Server Components. */
async function getCurrentUser(): Promise<AuthUserDTO | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      jobTitle: payload.jobTitle as string,
    };
  } catch {
    return null;
  }
}

/** Require an authenticated user, redirecting to /login otherwise. */
export async function requireUser(): Promise<AuthUserDTO> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}
