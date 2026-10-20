import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'ru' | 'uz' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ru', // Default: RU
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'etagi-language',
    }
  )
);

// Language labels
export const LANGUAGE_LABELS: Record<Language, { name: string; flag: string; native: string }> = {
  ru: { name: 'Русский', flag: '🇷🇺', native: 'RU' },
  uz: { name: "O'zbekcha", flag: '🇺🇿', native: 'UZ' },
  en: { name: 'English', flag: '🇬🇧', native: 'EN' },
};