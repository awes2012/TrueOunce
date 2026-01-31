import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { TradingProvider } from "../app/providers/TradingProvider";
import type { TradingState } from "../app/lib/types";

const STORAGE_KEY = "trueounce-trading-state";

const baseState: TradingState = {
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

export const seedTradingState = (state: Partial<TradingState>) => {
  const nextState = { ...baseState, ...state };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  return nextState;
};

export const renderWithTrading = (ui: ReactElement) =>
  render(<TradingProvider>{ui}</TradingProvider>);
