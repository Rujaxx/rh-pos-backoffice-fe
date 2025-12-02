'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Logo } from '../common/logo';
import { LanguageSwitcher } from '../common/language-switcher';
import { useTranslation } from '@/hooks/useTranslation';

export function ResetPasswordForm() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSuccess(true);
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
                  {t('auth.resetPassword.title')}
                </h2>
                <p className="text-slate-600">
                  {t('auth.resetPassword.subtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {t('auth.resetPassword.newPasswordLabel')}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 rtl:left-auto rtl:right-3" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t(
                        'auth.resetPassword.newPasswordPlaceholder',
                      )}
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

                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-2 w-full rounded-full ${
                              level <= passwordStrength
                                ? strengthColors[passwordStrength - 1]
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600">
                        Password strength:{' '}
                        {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {t('auth.resetPassword.confirmPasswordLabel')}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 rtl:left-auto rtl:right-3" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t(
                        'auth.resetPassword.confirmPasswordPlaceholder',
                      )}
                      className="pl-10 pr-10 rtl:pl-10 rtl:pr-10"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 rtl:right-auto rtl:left-3"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-600">
                        Passwords do not match
                      </p>
                    )}
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">
                    Password requirements
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`}
                      />
                      <span>At least 8 characters</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'}`}
                      />
                      <span>One uppercase letter</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'}`}
                      />
                      <span>One lowercase letter</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'}`}
                      />
                      <span>One number</span>
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isLoading ||
                    formData.password !== formData.confirmPassword ||
                    passwordStrength < 3
                  }
                >
                  {isLoading
                    ? t('auth.resetPassword.resettingPassword')
                    : t('auth.resetPassword.resetPasswordButton')}
                </Button>
              </form>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                  {t('auth.resetPassword.backToLogin')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              {/* Mobile logo */}
              <div className="flex items-center justify-center mb-8">
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
                  Password reset successful
                </h2>
                <p className="text-slate-600 mb-6">
                  Your password has been successfully reset. You can now sign in
                  with your new password.
                </p>
              </div>

              <div className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Sign in to your account</Link>
                </Button>

                <p className="text-sm text-slate-500">
                  For security reasons, you&apos;ll need to sign in again on all
                  your devices.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
