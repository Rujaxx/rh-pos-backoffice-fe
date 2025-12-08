import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'RH POS Backoffice',
  description: 'Backoffice for RH POS system - Register',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
