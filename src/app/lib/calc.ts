import type { PriceFeed, Trade, TradingState } from "./types";

export const formatCurrency = (value: number, currency: "USD" | "CAD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

export const formatNumber = (value: number, digits = 2) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

export const calcTradeImpact = (
  state: TradingState,
  trade: Trade,
): TradingState => {
  if (trade.side === "buy") {
    const cost = trade.ounces * trade.priceUsd;
    const newCash = state.cashUsd - cost;
    const newOunces = state.ounces + trade.ounces;
    const newAvg =
      newOunces > 0
        ? (state.avgCostUsd * state.ounces + cost) / newOunces
        : 0;

    return {
      ...state,
      cashUsd: newCash,
      ounces: newOunces,
      avgCostUsd: newAvg,
      trades: [trade, ...state.trades],
    };
  }

  const proceeds = trade.ounces * trade.priceUsd;
  const newOunces = Math.max(state.ounces - trade.ounces, 0);

  return {
    ...state,
    cashUsd: state.cashUsd + proceeds,
    ounces: newOunces,
    avgCostUsd: newOunces === 0 ? 0 : state.avgCostUsd,
    trades: [trade, ...state.trades],
  };
};

export const calcPortfolio = (state: TradingState, priceFeed: PriceFeed) => {
  const spot = priceFeed.spotUsd;
  const positionValue = state.ounces * spot;
  const costBasis = state.ounces * state.avgCostUsd;
  const unrealized = positionValue - costBasis;
  const totalValue = state.cashUsd + positionValue;
  const dailyPnL = state.ounces * (priceFeed.ohlc.close - priceFeed.ohlc.open);
  const totalReturnPct =
    costBasis > 0 ? (unrealized / costBasis) * 100 : 0;

  return {
    positionValue,
    costBasis,
    unrealized,
    totalValue,
    dailyPnL,
    totalReturnPct,
  };
};

export const calcRiskPreview = (
  ounces: number,
  spotUsd: number,
  movePct: number,
) => {
  const delta = spotUsd * (movePct / 100);
  const before = ounces * spotUsd;
  const after = ounces * (spotUsd + delta);
  return {
    before,
    after,
    change: after - before,
  };
};
