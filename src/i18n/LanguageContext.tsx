import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: Language[];
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
