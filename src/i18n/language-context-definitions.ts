import { createContext } from 'react';
import { Language } from './language-constants';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: Language[];
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
