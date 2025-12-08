import type { Metadata } from 'next';
import { ForgotForm } from '@/components/auth/forgot-form';

export const metadata: Metadata = {
  title: 'RH POS Backoffice',
  description: 'Backoffice for RH POS system - Forgot Password',
};

export default function ForgotPage() {
  return <ForgotForm />;
}
