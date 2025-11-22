"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Link from "next/link";
import { Logo } from "../common/logo";
import { LanguageSwitcher } from "../common/language-switcher";
import { useTranslation } from "@/hooks/useTranslation";
import { useLogin } from "@/services/api/auth/auth.mutations";
import { useIsAuthenticated } from "@/stores/auth.store";
import { useLoginForm } from "@/hooks/useLoginForm";
import { LoginFormData } from "@/lib/validations/auth.validation";
import { User, Lock } from "lucide-react";
import { ThemeToggle } from "../common/theme-toggle";

export function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = useLogin();
  const { form } = useLoginForm();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Restore remembered username on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rememberedUsername = localStorage.getItem(
        "rh-pos-remember-username",
      );
      if (rememberedUsername) {
        form.setValue("username", rememberedUsername);
        form.setValue("rememberMe", true);
      }
    }
  }, [form]);

  const onSubmit = (data: LoginFormData) => {
    const { rememberMe, ...credentials } = data;

    login(credentials, {
      onSuccess: () => {
        // Show success message
        toast.success(t("auth.login.success") || "Login successful");

        // Handle Remember Me functionality
        if (rememberMe) {
          // Store username for future logins
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "rh-pos-remember-username",
              credentials.username,
            );
          }
        } else {
          // Clear remembered username if not selected
          if (typeof window !== "undefined") {
            localStorage.removeItem("rh-pos-remember-username");
          }
        }

        // Redirect to dashboard on successful login
        router.push("/dashboard");
      },
      onError: (error: unknown) => {
        // Handle login error with toast
        let errorMessage = "Login failed. Please try again.";

        if (error && typeof error === "object" && "message" in error) {
          errorMessage = (error as { message: string }).message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 from-slate-50 to-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Header with Logo and Language Switcher */}
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center justify-center">
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Main Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl text-center">
                  {t("auth.login.title")}
                </CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                  {t("auth.login.subtitle")}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.login.usernameLabel")}</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 rtl:left-auto rtl:right-3" />
                        <FormControl>
                          <input
                            {...field}
                            type="text"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rtl:pl-3 rtl:pr-10"
                            placeholder={t("auth.login.usernamePlaceholder")}
                            autoComplete="username"
                            disabled={isPending}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.login.passwordLabel")}</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 rtl:left-auto rtl:right-3" />
                        <FormControl>
                          <input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rtl:pl-10 rtl:pr-10"
                            placeholder={t("auth.login.passwordPlaceholder")}
                            disabled={isPending}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 rtl:right-auto rtl:left-3"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isPending}
                        >
                          {showPassword ? (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122L7.76 7.76M12 12l2.122 2.122L16.24 16.24M7.76 7.76l-1.415-1.415M16.24 16.24l1.415 1.415"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remember Me Switch */}
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0">
                      <FormLabel className="text-sm font-normal">
                        {t("auth.login.rememberMe")}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Test Credentials Helper (only in development) */}
                {process.env.NODE_ENV === "development" && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-xs text-blue-800 font-medium mb-1">
                      Test Credentials:
                    </p>
                    <p className="text-xs text-blue-600">
                      Username:{" "}
                      <code className="bg-blue-100 px-1 rounded">admin</code>
                    </p>
                    <p className="text-xs text-blue-600">
                      Password:{" "}
                      <code className="bg-blue-100 px-1 rounded">
                        Admin@123!
                      </code>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link
                href="/forgot"
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                {t("auth.login.forgotPassword")}
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isPending}
            >
              {isPending
                ? t("auth.login.signingIn")
                : t("auth.login.signInButton")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
