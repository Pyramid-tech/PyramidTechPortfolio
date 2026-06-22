import type { Metadata } from 'next';
import { LoginForm } from '@/components/forms';

export const metadata: Metadata = { title: 'Login | Pyramid' };

export default function LoginPage() {
  return <LoginForm />;
}
