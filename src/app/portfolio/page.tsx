"use client";

import { useEffect } from "react";
import { calcPortfolio, formatCurrency, formatNumber } from "../lib/calc";
import { usePriceFeed } from "../lib/usePriceFeed";
import { useTrading } from "../providers/TradingProvider";

export default function PortfolioPage() {
  const { state, setCurrency, setFxRate } = useTrading();
  const { feed, fxRate } = usePriceFeed();

  useEffect(() => {
    setFxRate(fxRate);
  }, [fxRate, setFxRate]);

  const convert = (usd: number) =>
    state.currency === "CAD" ? usd * state.fxRate : usd;

  const portfolio = calcPortfolio(state, feed);

  return (
    <div className="flex flex-col gap-6">
      <div className="glass rounded-[32px] p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--smoke)]">
          Portfolio
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          Ounce-based portfolio view
        </h1>
        <p className="mt-2 text-sm text-[color:var(--smoke)]">
          Track your silver position with clear costs, value, and P/L.
        </p>
        <div className="mt-6 flex gap-2">
          {(["USD", "CAD"] as const).map((currency) => (
            <button
              key={currency}
              onClick={() => setCurrency(currency)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                state.currency === currency
                  ? "bg-[color:var(--ink)] text-[color:var(--paper)]"
                  : "border border-[color:var(--ink)]/10 bg-white/70 text-[color:var(--ink)]"
              }`}
            >
              {currency}
            </button>
          ))}
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--smoke)]">
            Balances
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
              <p className="text-sm text-[color:var(--smoke)]">Cash</p>
              <p className="mt-2 text-2xl font-semibold font-mono">
                {formatCurrency(convert(state.cashUsd), state.currency)}
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
              <p className="text-sm text-[color:var(--smoke)]">Silver held</p>
              <p className="mt-2 text-2xl font-semibold font-mono">
                {formatNumber(state.ounces, 2)} oz
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
              <p className="text-sm text-[color:var(--smoke)]">Avg cost / oz</p>
              <p className="mt-2 text-2xl font-semibold font-mono">
                {formatCurrency(convert(state.avgCostUsd), state.currency)}
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
              <p className="text-sm text-[color:var(--smoke)]">Position value</p>
              <p className="mt-2 text-2xl font-semibold font-mono">
                {formatCurrency(convert(portfolio.positionValue), state.currency)}
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[color:var(--smoke)]">Total value</p>
              <p className="text-sm text-[color:var(--smoke)]">Total return</p>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-semibold font-mono">
                {formatCurrency(convert(portfolio.totalValue), state.currency)}
              </p>
              <p
                className={`text-lg font-semibold ${
                  portfolio.totalReturnPct >= 0
                    ? "text-[color:var(--verdigris)]"
                    : "text-[color:var(--vermilion)]"
                }`}
              >
                {portfolio.totalReturnPct >= 0 ? "+" : ""}
                {formatNumber(portfolio.totalReturnPct, 2)}%
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--smoke)]">
            Performance
          </p>
          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
              <p className="text-sm text-[color:var(--smoke)]">Daily P/L</p>
              <p
                className={`mt-2 text-2xl font-semibold font-mono ${
                  portfolio.dailyPnL >= 0
                    ? "text-[color:var(--verdigris)]"
                    : "text-[color:var(--vermilion)]"
                }`}
              >
                {formatCurrency(convert(portfolio.dailyPnL), state.currency)}
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
              <p className="text-sm text-[color:var(--smoke)]">Unrealized P/L</p>
              <p
                className={`mt-2 text-2xl font-semibold font-mono ${
                  portfolio.unrealized >= 0
                    ? "text-[color:var(--verdigris)]"
                    : "text-[color:var(--vermilion)]"
                }`}
              >
                {formatCurrency(convert(portfolio.unrealized), state.currency)}
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
              <p className="text-sm text-[color:var(--smoke)]">Cost basis</p>
              <p className="mt-2 text-2xl font-semibold font-mono">
                {formatCurrency(convert(portfolio.costBasis), state.currency)}
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4 text-sm">
            <p className="font-semibold">Snapshot</p>
            <p className="mt-2 text-[color:var(--smoke)]">
              Spot price: {formatCurrency(convert(feed.spotUsd), state.currency)}
              . FX rate: 1 USD = {formatNumber(state.fxRate, 2)} CAD.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
