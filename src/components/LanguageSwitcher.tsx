'use client';

import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh-CN', label: '中文 (简体)' },
  { code: 'ar', label: 'العربية' },
  { code: 'ru', label: 'Русский' },
  { code: 'ja', label: '日本語' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'pt', label: 'Português' }
];


export default function LanguageSwitcher() {
  const { i18n: i18next } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    // Optional: persist language in localStorage
    localStorage.setItem('language', lang);
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      value={i18next.language}
      className="p-2 rounded border"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
