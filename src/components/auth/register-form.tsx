"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, Building } from "lucide-react";
import { Logo } from "../common/logo";
import { LanguageSwitcher } from "../common/language-switcher";
import { useTranslation } from "@/hooks/useTranslation";

export function RegisterForm() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    password: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Redirect to dashboard
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Logo />
              <LanguageSwitcher />
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {t("auth.register.title")}
              </h2>
              <p className="text-slate-600">{t("auth.register.subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {t("auth.register.firstNameLabel")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 rtl:left-auto rtl:right-3" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder={t("auth.register.firstNamePlaceholder")}
                      className="pl-10 rtl:pl-3 rtl:pr-10"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    {t("auth.register.lastNameLabel")}
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder={t("auth.register.lastNamePlaceholder")}
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.register.emailLabel")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 rtl:left-auto rtl:right-3" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("auth.register.emailPlaceholder")}
                    className="pl-10 rtl:pl-3 rtl:pr-10"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">{t("auth.register.roleLabel")}</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 rtl:left-auto rtl:right-3" />
                  <Input
                    id="company"
                    type="text"
                    placeholder={t("auth.register.rolePlaceholder")}
                    className="pl-10 rtl:pl-3 rtl:pr-10"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {t("auth.register.passwordLabel")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 rtl:left-auto rtl:right-3" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.register.passwordPlaceholder")}
                    className="pl-10 pr-10 rtl:pl-10 rtl:pr-10"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 rtl:right-auto rtl:left-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        agreeToTerms: checked as boolean,
                      })
                    }
                    required
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-slate-600 leading-5"
                  >
                    {t("auth.register.agreeToTerms")}{" "}
                    <Link
                      href="/terms"
                      className="text-slate-900 hover:text-slate-700 font-medium"
                    >
                      {t("auth.register.termsOfService")}
                    </Link>{" "}
                    {t("auth.register.and")}{" "}
                    <Link
                      href="/privacy"
                      className="text-slate-900 hover:text-slate-700 font-medium"
                    >
                      {t("auth.register.privacyPolicy")}
                    </Link>
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !formData.agreeToTerms}
              >
                {isLoading
                  ? t("auth.register.creatingAccount")
                  : t("auth.register.createAccountButton")}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-slate-600">
                {t("auth.register.alreadyHaveAccount")}{" "}
                <Link
                  href="/auth/login"
                  className="text-slate-900 hover:text-slate-700 font-medium"
                >
                  {t("auth.register.signInLink")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
