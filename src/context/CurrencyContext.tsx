"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CurrencyCode = "COP" | "USD";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (priceCOP: number) => string;
  usdRate: number;
}

const DEFAULT_USD_RATE = 4100; // Tasa de cambio aproximada COP a USD

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "COP",
  setCurrency: () => {},
  formatPrice: (p) => `$${p.toLocaleString("es-CO")} COP`,
  usdRate: DEFAULT_USD_RATE,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("COP");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("procap_currency") as CurrencyCode | null;
      if (saved === "COP" || saved === "USD") {
        setCurrencyState(saved);
      }
    } catch (e) {
      // Ignorar en SSR
    }
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem("procap_currency", c);
    } catch (e) {}
  };

  const formatPrice = (priceCOP: number): string => {
    if (!priceCOP || priceCOP <= 0) return "$0";

    if (currency === "USD") {
      const priceUSD = Math.round(priceCOP / DEFAULT_USD_RATE);
      return `$${priceUSD.toLocaleString("en-US")} USD`;
    }

    return `$${priceCOP.toLocaleString("es-CO")} COP`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, usdRate: DEFAULT_USD_RATE }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

