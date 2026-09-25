import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/lib/i18n';

const LOCALES = [
  { code: 'id', label: 'ID', flag: '🇮🇩' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
] as const;

type LocaleCode = 'id' | 'en';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const current = (i18n.language || 'id').slice(0, 2) as LocaleCode;

  return (
    <div className="flex items-center gap-1 rounded-xl border border-slate-200 p-0.5 bg-slate-100">
      {LOCALES.map(({ code, label, flag }) => (
        <button
          key={code}
          type="button"
          onClick={() => changeLanguage(code)}
          title={`Switch to ${label}`}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
            current === code
              ? 'bg-white shadow-sm text-blue-700 border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
