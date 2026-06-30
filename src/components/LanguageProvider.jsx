import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getTranslation, supportedLanguages } from '../lib/translations.js';

const STORAGE_KEY = 'minefactory-lang';
const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === 'undefined') {
    return 'pt-BR';
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return supportedLanguages.includes(stored) ? stored : 'pt-BR';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: getTranslation(language),
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}

