import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "RH POS Backoffice",
  description: "Backoffice for RH POS system - Reset Password",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
