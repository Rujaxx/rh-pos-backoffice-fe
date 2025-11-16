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
import { ThemeToggle } from "../common/theme-toggle";

export function ForgotForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
    <div className="min-h-screen flex items-center justify-center p-4 from-slate-50 to-slate-100">
      <div className="w-full max-w-md space-y-6">
        {!isSuccess ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center justify-center">
                <Logo />
              </div>
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-1">
                {t("auth.forgot.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("auth.forgot.subtitle")}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="shadow-sm border rounded-lg p-6 space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.forgot.emailLabel")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 rtl:left-auto rtl:right-3" />
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
                href="/"
                className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                {t("auth.forgot.backToLogin")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="lg:hidden flex items-center justify-center mb-4">
              <Logo />
            </div>

            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {t("auth.forgot.successTitle") || "Check your email"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("auth.forgot.successMessage")} <strong>{email}</strong>
              </p>
            </div>

            <div className="bg-slate-50 border rounded-lg p-6 text-left shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">
                {t("auth.forgot.whatsNext") || "What's next?"}
              </h3>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    1
                  </span>
                  {t("auth.forgot.step1") ||
                    "Check your inbox (and spam folder)"}
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    2
                  </span>
                  {t("auth.forgot.step2") || "Open the password reset link"}
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    3
                  </span>
                  {t("auth.forgot.step3") || "Create a new password"}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleResendEmail}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading
                  ? t("auth.forgot.resending")
                  : t("auth.forgot.resendEmail")}
              </Button>

              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("auth.forgot.backToLogin")}
              </Link>
            </div>

            <div className="border-t pt-6 text-sm text-slate-500">
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{t("auth.forgot.expires") || "Expires in 24h"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>{t("auth.forgot.secure") || "Secure"}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4">
                {t("auth.forgot.needHelp")}{" "}
                <Link
                  href="/support"
                  className="text-slate-600 hover:text-slate-900"
                >
                  {t("auth.forgot.contactSupport")}
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
