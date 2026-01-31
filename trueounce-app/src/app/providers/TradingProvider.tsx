"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Alert, Currency, Trade, TradeSide, TradingState } from "../lib/types";
import { calcTradeImpact } from "../lib/calc";

type TradingContextValue = {
  state: TradingState;
  setCurrency: (currency: Currency) => void;
  setFxRate: (rate: number) => void;
  setDailyTradeLimit: (limit: number) => void;
  toggleCoolingOff: () => void;
  setMaxPositionOz: (limit: number) => void;
  executeTrade: (side: TradeSide, ounces: number, priceUsd: number, note?: string) => void;
  addAlert: (alert: Omit<Alert, "id" | "createdAt">) => void;
  removeAlert: (id: string) => void;
};

const initialState: TradingState = {
  currency: "USD",
  fxRate: 1.36,
  cashUsd: 10000,
  ounces: 0,
  avgCostUsd: 0,
  trades: [],
  dailyTradeLimit: 5,
  coolingOff: false,
  maxPositionOz: 120,
  alerts: [],
};

const TradingContext = createContext<TradingContextValue | null>(null);

const STORAGE_KEY = "trueounce-trading-state";

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TradingState>(initialState);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as TradingState;
      setState({ ...initialState, ...parsed });
    } catch {
      setState(initialState);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setCurrency = (currency: Currency) => {
    setState((prev) => ({ ...prev, currency }));
  };

  const setFxRate = (rate: number) => {
    setState((prev) => ({ ...prev, fxRate: rate }));
  };

  const setDailyTradeLimit = (limit: number) => {
    if (!Number.isFinite(limit) || limit <= 0) return;
    setState((prev) => ({ ...prev, dailyTradeLimit: Math.floor(limit) }));
  };

  const toggleCoolingOff = () => {
    setState((prev) => ({ ...prev, coolingOff: !prev.coolingOff }));
  };

  const setMaxPositionOz = (limit: number) => {
    if (!Number.isFinite(limit) || limit <= 0) return;
    setState((prev) => ({ ...prev, maxPositionOz: limit }));
  };

  const executeTrade = (
    side: TradeSide,
    ounces: number,
    priceUsd: number,
    note?: string,
  ) => {
    const trade: Trade = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      side,
      ounces,
      priceUsd,
      timestamp: new Date().toISOString(),
      note,
    };

    setState((prev) => calcTradeImpact(prev, trade));
  };

  const addAlert = (alert: Omit<Alert, "id" | "createdAt">) => {
    setState((prev) => ({
      ...prev,
      alerts: [
        {
          ...alert,
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          createdAt: new Date().toISOString(),
        },
        ...prev.alerts,
      ],
    }));
  };

  const removeAlert = (id: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((alert) => alert.id !== id),
    }));
  };

  const value = useMemo(
    () => ({
      state,
      setCurrency,
      setFxRate,
      setDailyTradeLimit,
      toggleCoolingOff,
      setMaxPositionOz,
      executeTrade,
      addAlert,
      removeAlert,
    }),
    [state],
  );

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error("useTrading must be used within TradingProvider");
  }
  return context;
}
