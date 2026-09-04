import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import fr from "./fr";
import en from "./en";
import type { Translations } from "./fr";

export type Locale = "fr" | "en";

const STORAGE_KEY = "kumpax-locale";

const DICTIONARIES: Record<Locale, Translations> = { fr, en };

function isLocale(value: string | null): value is Locale {
  return value === "fr" || value === "en";
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "fr";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isLocale(stored) ? stored : "fr";
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = DICTIONARIES[locale].htmlLang;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: DICTIONARIES[locale] }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

/** Convenience hook for components that only need the translation dictionary. */
export function useTranslations() {
  return useLocale().t;
}
