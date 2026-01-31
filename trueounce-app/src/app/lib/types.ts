export type Currency = "USD" | "CAD";

export type TradeSide = "buy" | "sell";

export type Trade = {
  id: string;
  side: TradeSide;
  ounces: number;
  priceUsd: number;
  timestamp: string;
  note?: string;
};

export type Alert = {
  id: string;
  type: "price" | "move";
  direction: "above" | "below";
  priceUsd?: number;
  movePct?: number;
  createdAt: string;
};

export type Ohlc = {
  open: number;
  high: number;
  low: number;
  close: number;
};

export type PricePoint = {
  label: string;
  usd: number;
};

export type PriceFeed = {
  spotUsd: number;
  changePct: number;
  ohlc: Ohlc;
  history: Record<"1D" | "1W" | "1M" | "1Y", PricePoint[]>;
};

export type TradingState = {
  currency: Currency;
  fxRate: number;
  cashUsd: number;
  ounces: number;
  avgCostUsd: number;
  trades: Trade[];
  dailyTradeLimit: number;
  coolingOff: boolean;
  maxPositionOz: number;
  alerts: Alert[];
};
