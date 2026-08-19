"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "NGN";

// NOTE: this only swaps the displayed symbol. It does NOT convert the
// underlying numeric value — switching to EUR does not turn ₦5,000
// into an actual Euro-equivalent amount. Real conversion requires a
// live exchange-rate source and is out of scope here.
const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
};

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatMoney: (amount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("NGN");

  useEffect(() => {
    const saved = localStorage.getItem("currency") as CurrencyCode | null;
    if (saved && CURRENCY_SYMBOLS[saved]) {
      setCurrencyState(saved);
    }

    // Keeps other open tabs/windows in sync: the "storage" event fires
    // in every OTHER tab (not the one that made the change) whenever
    // localStorage is written, so this picks up currency changes made
    // elsewhere without needing a manual refresh.
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "currency" && e.newValue && CURRENCY_SYMBOLS[e.newValue as CurrencyCode]) {
        setCurrencyState(e.newValue as CurrencyCode);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setCurrency = (next: CurrencyCode) => {
    setCurrencyState(next);
    localStorage.setItem("currency", next);
  };

  const formatMoney = (amount: number) =>
    `${CURRENCY_SYMBOLS[currency]}${amount.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}`;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatMoney }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}