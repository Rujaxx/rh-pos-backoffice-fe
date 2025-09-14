'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          404
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t('error.pageNotFound')}
        </h2>
        <p className="text-muted-foreground max-w-[500px]">
          {t('error.pageNotFoundDescription')}
        </p>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mt-4"
        >
          {t('common.goBack')}
        </Button>
      </div>
    </div>
  )
}