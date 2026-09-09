/**
 * Business Communication OS - Language & RTL Context
 * Feature IDs: UI-005, UI-006, UI-007, UI-008
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Direction, translations, TranslationDictionary } from './translations';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  t: TranslationDictionary;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'business_os_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = direction === 'rtl';

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      direction,
      t: translations[language],
      setLanguage,
      isRTL,
    }}>
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
