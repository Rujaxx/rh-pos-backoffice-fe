'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
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
import { Mail, ArrowLeft, CheckCircle, Clock, Shield } from 'lucide-react';
import { Logo } from '../common/logo';
import { LanguageSwitcher } from '../common/language-switcher';
import { useTranslation } from '@/hooks/useTranslation';
import { ThemeToggle } from '../common/theme-toggle';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useForgotPassword } from '@/services/api/auth/auth.mutations';
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from '@/lib/validations/auth.validation';
import { ApiError } from '@/types/api';

export function ForgotForm() {
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = (data: ForgotPasswordFormData) => {
    // Normalize email before sending
    const normalizedData = {
      email: data.email.toLowerCase().trim(),
    };

    forgotPassword(normalizedData, {
      onSuccess: (response) => {
        setSubmittedEmail(data.email as string);
        setIsSuccess(true);
        toast.success(
          response.data.message || 'Password reset link sent successfully!',
        );
      },
      onError: (error: unknown) => {
        // Handle forgot password error with single toast
        let errorMessage = 'Failed to send reset link. Please try again.';

        // Check if it's an ApiError instance
        if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as ApiError;

          // Handle validation errors
          if (
            apiError.response.validationErrors &&
            apiError.response.validationErrors.length > 0
          ) {
            errorMessage = apiError.response.validationErrors[0];
          } else {
            errorMessage =
              apiError.response.message ||
              apiError.response.errorCode ||
              errorMessage;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        // Show only ONE toast
        toast.error(errorMessage);
      },
    });
  };

  const handleResendEmail = () => {
    const emailData = { email: submittedEmail };

    forgotPassword(emailData, {
      onSuccess: (response) => {
        toast.success(
          response.data.message || 'Reset link resent successfully!',
        );
      },
      onError: (error: unknown) => {
        // Handle resend error with single toast
        let errorMessage = 'Failed to resend link. Please try again.';

        if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as ApiError;

          if (
            apiError.response.validationErrors &&
            apiError.response.validationErrors.length > 0
          ) {
            errorMessage = apiError.response.validationErrors[0];
          } else {
            errorMessage =
              apiError.response.message ||
              apiError.response.errorCode ||
              errorMessage;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        toast.error(errorMessage);
      },
    });
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
                      {t('auth.forgot.title')}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground text-center">
                      {t('auth.forgot.subtitle')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.forgot.emailLabel')}</FormLabel>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 rtl:left-auto rtl:right-3" />
                            <FormControl>
                              <input
                                {...field}
                                type="email"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rtl:pl-3 rtl:pr-10"
                                placeholder={t('auth.forgot.emailPlaceholder')}
                                autoComplete="email"
                                disabled={isPending}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Back to Login Link */}
                <div className="text-center">
                  <Link
                    href="/"
                    className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                    {t('auth.forgot.backToLogin')}
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
                    ? t('auth.forgot.sendingLink')
                    : t('auth.forgot.sendResetLink')}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <div className="space-y-6">
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
                    {t('auth.forgot.successTitle') || 'Check your email'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t('auth.forgot.successMessage')}{' '}
                    <strong>{submittedEmail}</strong>
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-6 text-left">
                  <h3 className="font-semibold mb-4">
                    {t('auth.forgot.whatsNext') || "What's next?"}
                  </h3>

                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                        1
                      </span>
                      <span>
                        {t('auth.forgot.step1') ||
                          'Check your inbox (and spam folder)'}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                        2
                      </span>
                      <span>
                        {t('auth.forgot.step2') ||
                          'Open the password reset link'}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                        3
                      </span>
                      <span>
                        {t('auth.forgot.step3') || 'Create a new password'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendEmail}
                    disabled={isPending}
                    className="w-full"
                  >
                    {isPending
                      ? t('auth.forgot.resending')
                      : t('auth.forgot.resendEmail')}
                  </Button>

                  <Link
                    href="/"
                    className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                    {t('auth.forgot.backToLogin')}
                  </Link>
                </div>

                <div className="border-t pt-6 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {t('auth.forgot.expires') || 'Expires in 24h'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>{t('auth.forgot.secure') || 'Secure'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground/60 mt-4">
                    {t('auth.forgot.needHelp')}{' '}
                    <Link
                      href="/support"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {t('auth.forgot.contactSupport')}
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
