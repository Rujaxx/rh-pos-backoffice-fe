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
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react';
import { Logo } from '../common/logo';
import { LanguageSwitcher } from '../common/language-switcher';
import { ThemeToggle } from '../common/theme-toggle';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRegister } from '@/services/api/auth/auth.mutations';
import {
  registerSchema,
  RegisterFormData,
} from '@/lib/validations/auth.validation';
import { ApiError } from '@/types/api';

export function RegisterForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: register, isPending } = useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      company: '',
      countryCode: undefined,
      phoneNumber: undefined,
      password: '',
      agreeToTerms: false,
    },
  });

  const handleSubmit = (data: RegisterFormData) => {
    register(data, {
      onSuccess: () => {
        toast.success('Account created successfully!');
        router.push('/dashboard');
      },
      onError: (error: unknown) => {
        // Handle registration error with single toast
        let errorMessage = 'Registration failed. Please try again.';

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
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl text-center">
                  {t('auth.register.title')}
                </CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                  {t('auth.register.subtitle')}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('auth.register.nameLabel') || 'Full Name'}
                      </FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 rtl:left-auto rtl:right-3" />
                        <FormControl>
                          <input
                            {...field}
                            type="text"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rtl:pl-3 rtl:pr-10"
                            placeholder={
                              t('auth.register.namePlaceholder') || 'John Doe'
                            }
                            disabled={isPending}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('auth.register.usernameLabel') || 'Username'}
                      </FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 rtl:left-auto rtl:right-3" />
                        <FormControl>
                          <input
                            {...field}
                            type="text"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rtl:pl-3 rtl:pr-10"
                            placeholder={
                              t('auth.register.usernamePlaceholder') ||
                              'johndoe123'
                            }
                            disabled={isPending}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.register.emailLabel')}</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 rtl:left-auto rtl:right-3" />
                        <FormControl>
                          <input
                            {...field}
                            type="email"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rtl:pl-3 rtl:pr-10"
                            placeholder={t('auth.register.emailPlaceholder')}
                            autoComplete="email"
                            disabled={isPending}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company Field */}
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('auth.register.companyLabel') || 'Company Name'}
                      </FormLabel>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 rtl:left-auto rtl:right-3" />
                        <FormControl>
                          <input
                            {...field}
                            type="text"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rtl:pl-3 rtl:pr-10"
                            placeholder={
                              t('auth.register.companyPlaceholder') ||
                              'Acme Restaurant Group'
                            }
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
                      <FormLabel>{t('auth.register.passwordLabel')}</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 rtl:left-auto rtl:right-3" />
                        <FormControl>
                          <input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rtl:pl-10 rtl:pr-10"
                            placeholder={t('auth.register.passwordPlaceholder')}
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

                {/* Terms and Conditions */}
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          {t('auth.register.agreeToTerms')}{' '}
                          <Link
                            href="/terms"
                            className="text-primary hover:text-primary/80 font-medium"
                          >
                            {t('auth.register.termsOfService')}
                          </Link>{' '}
                          {t('auth.register.and')}{' '}
                          <Link
                            href="/privacy"
                            className="text-primary hover:text-primary/80 font-medium"
                          >
                            {t('auth.register.privacyPolicy')}
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Already have account link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.register.alreadyHaveAccount')}{' '}
                <Link
                  href="/"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  {t('auth.register.signInLink')}
                </Link>
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isPending}
            >
              {isPending
                ? t('auth.register.creatingAccount')
                : t('auth.register.createAccountButton')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
