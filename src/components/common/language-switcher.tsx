'use client'

import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/providers/i18n-provider'

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en'
    setLocale(newLocale)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {locale === 'en' ? 'العربية' : 'English'}
    </Button>
  )
}
