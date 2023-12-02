'use client';

import { I18nextProvider } from 'react-i18next';
import initTranslations from '@/locales/initI18n';
import { createInstance } from 'i18next';
import React from 'react'

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources
}: {
  children: React.ReactNode,
  locale: string,
  namespaces: string[],
  resources: any
}) {
  const i18n = createInstance();

  initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n as any}>{children}</I18nextProvider>;
}