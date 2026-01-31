import { describe, expect, it } from "vitest";
import { calcPortfolio, calcRiskPreview, calcTradeImpact } from "./calc";
import type { PriceFeed, Trade, TradingState } from "./types";

const baseState: TradingState = {
  currency: "USD",
  fxRate: 1.36,
  cashUsd: 1000,
  ounces: 0,
  avgCostUsd: 0,
  trades: [],
  dailyTradeLimit: 5,
  coolingOff: false,
  maxPositionOz: 120,
  alerts: [],
};

const priceFeed: PriceFeed = {
  spotUsd: 30,
  changePct: 2,
  ohlc: { open: 29, high: 31, low: 28, close: 30 },
  history: {
    "1D": [],
    "1W": [],
    "1M": [],
    "1Y": [],
  },
};

describe("calcTradeImpact", () => {
  it("updates cash, ounces, and average cost for buys", () => {
    const buyOne: Trade = {
      id: "t1",
      side: "buy",
      ounces: 10,
      priceUsd: 20,
      timestamp: new Date().toISOString(),
    };
    const afterFirst = calcTradeImpact(baseState, buyOne);
    expect(afterFirst.cashUsd).toBe(800);
    expect(afterFirst.ounces).toBe(10);
    expect(afterFirst.avgCostUsd).toBe(20);

    const buyTwo: Trade = {
      id: "t2",
      side: "buy",
      ounces: 5,
      priceUsd: 30,
      timestamp: new Date().toISOString(),
    };
    const afterSecond = calcTradeImpact(afterFirst, buyTwo);
    expect(afterSecond.cashUsd).toBe(650);
    expect(afterSecond.ounces).toBe(15);
    expect(afterSecond.avgCostUsd).toBeCloseTo(23.3333, 4);
  });

  it("reduces ounces and keeps avg cost on partial sells", () => {
    const state: TradingState = {
      ...baseState,
      cashUsd: 500,
      ounces: 10,
      avgCostUsd: 25,
    };
    const sellTrade: Trade = {
      id: "t3",
      side: "sell",
      ounces: 4,
      priceUsd: 30,
      timestamp: new Date().toISOString(),
    };
    const next = calcTradeImpact(state, sellTrade);
    expect(next.ounces).toBe(6);
    expect(next.avgCostUsd).toBe(25);
    expect(next.cashUsd).toBe(620);
  });

  it("resets avg cost when position is fully sold", () => {
    const state: TradingState = {
      ...baseState,
      cashUsd: 500,
      ounces: 4,
      avgCostUsd: 25,
    };
    const sellTrade: Trade = {
      id: "t4",
      side: "sell",
      ounces: 4,
      priceUsd: 30,
      timestamp: new Date().toISOString(),
    };
    const next = calcTradeImpact(state, sellTrade);
    expect(next.ounces).toBe(0);
    expect(next.avgCostUsd).toBe(0);
  });
});

describe("calcPortfolio", () => {
  it("calculates portfolio values consistently", () => {
    const state: TradingState = {
      ...baseState,
      cashUsd: 500,
      ounces: 10,
      avgCostUsd: 25,
    };
    const portfolio = calcPortfolio(state, priceFeed);
    expect(portfolio.positionValue).toBe(300);
    expect(portfolio.costBasis).toBe(250);
    expect(portfolio.unrealized).toBe(50);
    expect(portfolio.totalValue).toBe(800);
    expect(portfolio.dailyPnL).toBe(10);
    expect(portfolio.totalReturnPct).toBe(20);
  });
});

describe("calcRiskPreview", () => {
  it("shows delta for a percent move", () => {
    const preview = calcRiskPreview(10, 30, 3);
    expect(preview.before).toBe(300);
    expect(preview.after).toBe(309);
    expect(preview.change).toBe(9);
  });
});
