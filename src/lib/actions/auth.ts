'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { loginSchema } from '@/lib/validations/auth';
import { verifyCredentials, AuthError, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth';

export type LoginResult = { ok: false; error: string };

/** Returns an error result on failure; redirects to /dashboard on success. */
export async function loginAction(data: { email: string; password: string }): Promise<LoginResult | void> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: 'Invalid email or password' };

  try {
    const { token } = await verifyCredentials(parsed.data.email, parsed.data.password);
    cookies().set(COOKIE_NAME, token, COOKIE_OPTIONS);
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : 'Login failed' };
  }

  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  cookies().set(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
  redirect('/login');
}
