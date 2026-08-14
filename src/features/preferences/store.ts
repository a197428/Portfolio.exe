import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'ru' | 'en';
export type Role = 'ai' | 'frontend';

interface PreferencesState {
  locale: Locale;
  role: Role;
  setLocale: (locale: Locale) => void;
  setRole: (role: Role) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      locale: 'en',
      role: 'ai',
      setLocale: (locale) => set({ locale }),
      setRole: (role) => set({ role }),
    }),
    { name: 'portfolio-preferences' },
  ),
);
