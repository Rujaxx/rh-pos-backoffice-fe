'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

// Import messages
import enMessages from '../../messages/en.json';
import arMessages from '../../messages/ar.json';

type Locale = 'en' | 'ar';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Record<string, string>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const messages = {
  en: enMessages,
  ar: arMessages,
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // Get locale from localStorage or default to 'en'
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'ar')) {
      setLocaleState(savedLocale);
    }
  }, []);

  useEffect(() => {
    // Update HTML attributes when locale changes
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const value = {
    locale,
    setLocale,
    messages: messages[locale],
  };

  return (
    <I18nContext.Provider value={value}>
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
        defaultLocale="en"
      >
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
