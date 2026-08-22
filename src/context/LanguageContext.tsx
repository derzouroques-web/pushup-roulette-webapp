import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Language, type Translations } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pushup_roulette_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as Language;
    if (saved && ['en', 'zh', 'fr'].includes(saved)) {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_KEY, lang);
  };

  const t = (key: keyof Translations, params?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.en;
    let template = dict[key] || translations.en[key] || String(key);

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        template = template.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
      });
    }

    return template;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
