import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "RH POS Backoffice",
  description: "Backoffice for RH POS system - Login",
};

export default function LoginPage() {
  return <LoginForm />;
}
