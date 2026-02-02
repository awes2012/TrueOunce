import type { PriceFeed, PricePoint } from "./types";

const history1D: PricePoint[] = [
  { label: "09:00", usd: 29.12 },
  { label: "10:00", usd: 29.24 },
  { label: "11:00", usd: 28.96 },
  { label: "12:00", usd: 29.38 },
  { label: "13:00", usd: 29.15 },
  { label: "14:00", usd: 29.6 },
  { label: "15:00", usd: 29.34 },
  { label: "16:00", usd: 29.84 },
];

const history1W: PricePoint[] = [
  { label: "Mon", usd: 27.9 },
  { label: "Tue", usd: 28.1 },
  { label: "Wed", usd: 28.6 },
  { label: "Thu", usd: 29.1 },
  { label: "Fri", usd: 29.84 },
];

const history1M: PricePoint[] = [
  { label: "W1", usd: 26.9 },
  { label: "W2", usd: 27.4 },
  { label: "W3", usd: 28.2 },
  { label: "W4", usd: 29.84 },
];

const history1Y: PricePoint[] = [
  { label: "Jan", usd: 22.4 },
  { label: "Mar", usd: 24.8 },
  { label: "May", usd: 26.1 },
  { label: "Jul", usd: 27.6 },
  { label: "Sep", usd: 28.9 },
  { label: "Nov", usd: 29.84 },
];

export const priceFeed: PriceFeed = {
  spotUsd: 29.84,
  changePct: 0.86,
  ohlc: {
    open: 29.12,
    high: 30.34,
    low: 28.66,
    close: 29.84,
  },
  history: {
    "1D": history1D,
    "1W": history1W,
    "1M": history1M,
    "1Y": history1Y,
  },
};
