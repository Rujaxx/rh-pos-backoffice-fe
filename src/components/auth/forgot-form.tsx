"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle, Clock, Shield } from "lucide-react";
import { Logo } from "../common/logo";
import { LanguageSwitcher } from "../common/language-switcher";
import { useTranslation } from "@/hooks/useTranslation";

export function ForgotForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSuccess(true);
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {!isSuccess ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Logo />
                <LanguageSwitcher />
              </div>

              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {t("auth.forgot.title")}
                </h2>
                <p className="text-slate-600">{t("auth.forgot.subtitle")}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.forgot.emailLabel")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 rtl:left-auto rtl:right-3" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("auth.forgot.emailPlaceholder")}
                      className="pl-10 rtl:pl-3 rtl:pr-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? t("auth.forgot.sendingLink")
                    : t("auth.forgot.sendResetLink")}
                </Button>
              </form>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                  {t("auth.forgot.backToLogin")}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center justify-center mb-8">
                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">
                  CMS Full Form
                </h1>
              </div>

              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Check your email
                </h2>
                <p className="text-slate-600 mb-4">
                  We&apos;ve sent a password reset link to{" "}
                  <strong>{email}</strong>
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 text-left">
                <h3 className="font-semibold text-slate-900 mb-4">
                  What&apos;s next?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">
                        1
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Check your email inbox (and spam folder)
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">
                        2
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Click the reset password link in the email
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">
                        3
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Create a new password and sign in
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full bg-transparent"
                >
                  {isLoading ? "Resending..." : "Resend email"}
                </Button>

                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
                </Link>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Link expires in 24h</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Secure & encrypted</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  Need help?{" "}
                  <Link
                    href="/support"
                    className="text-slate-600 hover:text-slate-900"
                  >
                    Contact support
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
