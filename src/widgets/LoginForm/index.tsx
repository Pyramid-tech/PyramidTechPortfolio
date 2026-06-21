'use client';

import { FC, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

const LoginForm: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? 'Login failed');
        return;
      }
      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-1 px-4">
      <div className="w-full max-w-md rounded-2xl border border-stroke bg-bg-2 p-10">
        <h1 className="mb-2 text-3xl font-bold uppercase tracking-widest text-primary">Pyramid</h1>
        <p className="mb-8 text-sm text-text-1/50">Admin access only</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest text-text-1/60">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-text-1 outline-none transition focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest text-text-1/60">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-text-1 outline-none transition focus:border-primary"
            />
          </div>

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
