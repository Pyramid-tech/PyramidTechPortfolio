'use client';

import { FC, FormEvent, useState } from 'react';

import { loginAction } from '@/lib/actions/auth';
import Button from '@/components/ui/button';
import Field from '@/components/ui/field';
import Input from '@/components/ui/input';

const LoginForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginAction({ email, password });
      // On success the action sets the session cookie and redirects to /dashboard.
      if (res && !res.ok) setError(res.error);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-1 px-4">
      <div className="w-full max-w-md rounded-2xl border border-stroke bg-bg-2 p-10">
        <h1 className="mb-2 font-display text-3xl font-bold uppercase tracking-widest text-primary">Pyramid</h1>
        <p className="mb-8 text-sm text-text-1/50">Admin access only</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="Email" labelClassName="text-text-1/60">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="px-4 py-3"
            />
          </Field>

          <Field label="Password" labelClassName="text-text-1/60">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="px-4 py-3"
            />
          </Field>

          {error && <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</p>}

          <Button
            type="submit"
            title={loading ? 'Signing in…' : 'Sign In'}
            disabled={loading}
            btnClasses="w-full mt-2"
            classes="w-full bg-bg-1 px-6"
          />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
