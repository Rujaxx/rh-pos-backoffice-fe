"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Logo } from "../common/logo"
import { LanguageSwitcher } from "../common/language-switcher"
import { useTranslation } from "@/hooks/useTranslation"

export function LoginForm() {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Redirect to dashboard
    window.location.href = "/dashboard"
  }


  return (
    <div className="min-h-screen flex">
      <div className="w-full flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <Logo />
            <LanguageSwitcher />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('auth.login.title')}</h2>
            <p className="text-slate-600">{t('auth.login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">{t('auth.login.emailLabel')}</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 rtl:left-auto rtl:right-3" />
                <Input
                  id="email"
                  type="email"
                  required
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                  placeholder={t('auth.login.emailPlaceholder')}
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">{t('auth.login.passwordLabel')}</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 rtl:left-auto rtl:right-3" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-10 pr-10 rtl:pl-10 rtl:pr-10"
                  placeholder={t('auth.login.passwordPlaceholder')}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 rtl:right-auto rtl:left-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))}
                />
                <Label htmlFor="remember" className="text-sm text-slate-600">
                  {t('auth.login.rememberMe')}
                </Label>
              </div>
              <Link href="/auth/forgot" className="text-sm text-slate-900 hover:text-slate-700 font-medium">
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.login.signingIn') : t('auth.login.signInButton')}
            </Button> 

            <div className="text-center">
              <span className="text-slate-600">{t('auth.login.noAccount')} </span>
              <Link href="/auth/register" className="text-slate-900 hover:text-slate-700 font-medium">
                {t('auth.login.signUpLink')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
