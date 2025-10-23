import { ReactNode, useEffect, useState } from 'react';
import { Language, languages } from './language-constants';
import { LanguageContext } from './language-context-definitions';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load translations for current language
    const loadTranslations = async () => {
      try {
        const response = await import(`./translations/${currentLanguage.code}.json`);
        setTranslations(response.default);
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  const value = {
    currentLanguage,
    setLanguage: setCurrentLanguage,
    t,
    languages,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
