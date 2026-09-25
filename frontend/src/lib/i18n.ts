import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import id from '@/locales/id.json';

const defaultLocale = (import.meta.env.VITE_DEFAULT_LOCALE as string) || 'id';

const savedLocale = localStorage.getItem('lfrms_locale') || defaultLocale;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      id: { translation: id },
    },
    lng: savedLocale,
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    defaultNS: 'translation',
  });

export default i18n;

/** Persist language preference and reload i18n */
export const changeLanguage = (locale: 'en' | 'id') => {
  localStorage.setItem('lfrms_locale', locale);
  i18n.changeLanguage(locale);
};
