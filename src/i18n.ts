// i18n.ts
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 🧠 Manually import all your translations here
import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import es from './locales/es/translation.json';
import de from './locales/de/translation.json';
import zhCN from './locales/zh-CN/translation.json';
import ar from './locales/ar/translation.json';
import ru from './locales/ru/translation.json';
import ja from './locales/ja/translation.json';
import hi from './locales/hi/translation.json';
import pt from './locales/pt/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      de: { translation: de },
      'zh-CN': { translation: zhCN },
      ar: { translation: ar },
      ru: { translation: ru },
      ja: { translation: ja },
      hi: { translation: hi },
      pt: { translation: pt },
    },
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es', 'de', 'zh-CN', 'ar', 'ru', 'ja', 'hi', 'pt'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;


