'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Logo } from '../common/logo';
import { LanguageSwitcher } from '../common/language-switcher';
import { ThemeToggle } from '../common/theme-toggle';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// Define reset password schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = form.watch('password');

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password || '');
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
  ];

  const handleSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // Get token from URL params
      // const searchParams = new URLSearchParams(window.location.search);
      // const token = searchParams.get('token');
      // const response = await api.post('/auth/reset-password', { ...data, token });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);
      toast.success('Password reset successfully!');
    } catch (error: unknown) {
      let errorMessage = 'Failed to reset password. Please try again.';

      // Check if it's an ApiError instance
      if (error && typeof error === 'object') {
        if ('response' in error) {
          const apiError = error as {
            response: { message?: string; errorCode?: string };
          };
          errorMessage =
            apiError.response.message ||
            apiError.response.errorCode ||
            errorMessage;
        } else if ('message' in error) {
          errorMessage = (error as { message: string }).message;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 from-slate-50 to-slate-100">
      <div className="w-full max-w-md space-y-6">
        {!isSuccess ? (
          <>
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
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <Card className="w-full max-w-md mx-auto">
                  <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-2xl text-center">
                      {t('auth.resetPassword.title')}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground text-center">
                      {t('auth.resetPassword.subtitle')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('auth.resetPassword.newPasswordLabel')}
                          </FormLabel>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 rtl:left-auto rtl:right-3" />
                            <FormControl>
                              <input
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rtl:pl-10 rtl:pr-10"
                                placeholder={t(
                                  'auth.resetPassword.newPasswordPlaceholder',
                                )}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 rtl:right-auto rtl:left-3"
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>

                          {password && (
                            <div className="space-y-2 mt-2">
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <div
                                    key={level}
                                    className={`h-2 w-full rounded-full ${
                                      level <= passwordStrength
                                        ? strengthColors[passwordStrength - 1]
                                        : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Password strength:{' '}
                                {strengthLabels[passwordStrength - 1] ||
                                  'Very Weak'}
                              </p>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password Field */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('auth.resetPassword.confirmPasswordLabel')}
                          </FormLabel>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 rtl:left-auto rtl:right-3" />
                            <FormControl>
                              <input
                                {...field}
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rtl:pl-10 rtl:pr-10"
                                placeholder={t(
                                  'auth.resetPassword.confirmPasswordPlaceholder',
                                )}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 rtl:right-auto rtl:left-3"
                              disabled={isLoading}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Requirements */}
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-medium mb-2">
                        Password requirements
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div
                            className={`w-2 h-2 rounded-full ${password && password.length >= 8 ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                          />
                          <span>At least 8 characters</span>
                        </li>
                        <li className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div
                            className={`w-2 h-2 rounded-full ${password && /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                          />
                          <span>One uppercase letter</span>
                        </li>
                        <li className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div
                            className={`w-2 h-2 rounded-full ${password && /[a-z]/.test(password) ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                          />
                          <span>One lowercase letter</span>
                        </li>
                        <li className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div
                            className={`w-2 h-2 rounded-full ${password && /[0-9]/.test(password) ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                          />
                          <span>One number</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Back to Login Link */}
                <div className="text-center">
                  <Link
                    href="/"
                    className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                    {t('auth.resetPassword.backToLogin')}
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading || passwordStrength < 3}
                >
                  {isLoading
                    ? t('auth.resetPassword.resettingPassword')
                    : t('auth.resetPassword.resetPasswordButton')}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <>
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

            {/* Success State */}
            <Card className="w-full max-w-md mx-auto">
              <CardContent className="pt-6 space-y-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    Password reset successful
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Your password has been successfully reset. You can now sign
                    in with your new password.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => router.push('/')}
                    className="w-full"
                    size="lg"
                  >
                    Sign in to your account
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    For security reasons, you&apos;ll need to sign in again on
                    all your devices.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
