"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type LanguageCode = "english" | "spanish" | "french" | "german";

// A hand-rolled dictionary, not a full i18n setup. Only covers the keys
// you actually add below — anything not listed here falls back to the
// English string (or the key itself, if even English is missing it).
// Extend this object as you add more translatable strings.
const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  english: {
    "nav.home": "Home",
    "nav.history": "History",
    "nav.categories": "Categories",
    "nav.analytics": "Analytics",
    "nav.budgets": "Budgets",
    "nav.reports": "Reports",
    "nav.notifications": "Notifications",
    "nav.businessMode": "Business Mode",
    "nav.settings": "Settings",
    "nav.profile": "Profile",
    "nav.billings": "Billings",
    "header.searchPlaceholder": "Search transaction...",
    "settings.title": "Settings",
    "settings.subtitle": "Manage your account preferences and settings",
    "settings.theme.light": "Light",
    "settings.theme.dark": "Dark",
    "settings.theme.system": "System",
  },
  spanish: {
    "nav.home": "Inicio",
    "nav.history": "Historial",
    "nav.categories": "Categorías",
    "nav.analytics": "Analítica",
    "nav.budgets": "Presupuestos",
    "nav.reports": "Informes",
    "nav.notifications": "Notificaciones",
    "nav.businessMode": "Modo Empresa",
    "nav.settings": "Configuración",
    "nav.profile": "Perfil",
    "nav.billings": "Facturación",
    "header.searchPlaceholder": "Buscar transacción...",
    "settings.title": "Configuración",
    "settings.subtitle": "Administra tus preferencias y ajustes de cuenta",
    "settings.theme.light": "Claro",
    "settings.theme.dark": "Oscuro",
    "settings.theme.system": "Sistema",
  },
  french: {
    "nav.home": "Accueil",
    "nav.history": "Historique",
    "nav.categories": "Catégories",
    "nav.analytics": "Analytique",
    "nav.budgets": "Budgets",
    "nav.reports": "Rapports",
    "nav.notifications": "Notifications",
    "nav.businessMode": "Mode Entreprise",
    "nav.settings": "Paramètres",
    "nav.profile": "Profil",
    "nav.billings": "Facturation",
    "header.searchPlaceholder": "Rechercher une transaction...",
    "settings.title": "Paramètres",
    "settings.subtitle": "Gérez vos préférences et paramètres de compte",
    "settings.theme.light": "Clair",
    "settings.theme.dark": "Sombre",
    "settings.theme.system": "Système",
  },
  german: {
    "nav.home": "Startseite",
    "nav.history": "Verlauf",
    "nav.categories": "Kategorien",
    "nav.analytics": "Analytik",
    "nav.budgets": "Budgets",
    "nav.reports": "Berichte",
    "nav.notifications": "Benachrichtigungen",
    "nav.businessMode": "Business-Modus",
    "nav.settings": "Einstellungen",
    "nav.profile": "Profil",
    "nav.billings": "Abrechnung",
    "header.searchPlaceholder": "Transaktion suchen...",
    "settings.title": "Einstellungen",
    "settings.subtitle": "Verwalte deine Kontoeinstellungen und Präferenzen",
    "settings.theme.light": "Hell",
    "settings.theme.dark": "Dunkel",
    "settings.theme.system": "System",
  },
};

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("english");

  useEffect(() => {
    const saved = localStorage.getItem("language") as LanguageCode | null;
    if (saved && TRANSLATIONS[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (next: LanguageCode) => {
    setLanguageState(next);
    localStorage.setItem("language", next);
  };

  const t = (key: string) =>
    TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.english[key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}