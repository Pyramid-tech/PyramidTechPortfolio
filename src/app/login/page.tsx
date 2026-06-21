import type { Metadata } from 'next';
import LoginForm from '@/widgets/LoginForm';

export const metadata: Metadata = { title: 'Login | Pyramid' };

export default function LoginPage() {
  return <LoginForm />;
}
