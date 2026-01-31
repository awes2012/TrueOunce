"use client";

import { useEffect, useMemo } from "react";
import { formatCurrency, formatNumber } from "../lib/calc";
import { usePriceFeed } from "../lib/usePriceFeed";
import { useTrading } from "../providers/TradingProvider";

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function HistoryPage() {
  const { state, setCurrency, setFxRate } = useTrading();
  const { fxRate } = usePriceFeed();

  useEffect(() => {
    setFxRate(fxRate);
  }, [fxRate, setFxRate]);

  const convert = (usd: number) =>
    state.currency === "CAD" ? usd * state.fxRate : usd;

  const csvRows = useMemo(() => {
    const header = [
      "timestamp",
      "side",
      "ounces",
      "price_usd",
      "total_usd",
      "note",
    ];
    const rows = state.trades.map((trade) => [
      trade.timestamp,
      trade.side,
      trade.ounces.toFixed(2),
      trade.priceUsd.toFixed(2),
      (trade.ounces * trade.priceUsd).toFixed(2),
      trade.note ? trade.note.replace(/"/g, '""') : "",
    ]);
    return [header, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");
  }, [state.trades]);

  const handleExport = () => {
    if (state.trades.length === 0) return;
    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trueounce-history-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="glass rounded-[32px] p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--smoke)]">
          Order history
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Every ounce logged</h1>
        <p className="mt-2 text-sm text-[color:var(--smoke)]">
          Review your paper trades and keep notes for discipline.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
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
          <button
            onClick={handleExport}
            disabled={state.trades.length === 0}
            className="rounded-full border border-[color:var(--ink)]/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--smoke)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Export CSV
          </button>
        </div>
      </div>

      <section className="glass rounded-[32px] p-6">
        <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr] gap-2 text-xs uppercase tracking-[0.2em] text-[color:var(--smoke)]">
          <span>Time</span>
          <span>Side</span>
          <span>Ounces</span>
          <span>Price</span>
          <span className="text-right">Total</span>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          {state.trades.length === 0 && (
            <div className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-6 text-sm text-[color:var(--smoke)]">
              No trades yet. Head to the Trade screen to place a paper order.
            </div>
          )}
          {state.trades.map((trade) => (
            <div key={trade.id} className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
              <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr] items-center gap-2">
                <span className="text-[color:var(--smoke)]">
                  {formatTimestamp(trade.timestamp)}
                </span>
                <span
                  className={`font-semibold ${
                    trade.side === "buy"
                      ? "text-[color:var(--ink)]"
                      : "text-[color:var(--vermilion)]"
                  }`}
                >
                  {trade.side.toUpperCase()}
                </span>
                <span className="font-mono">
                  {formatNumber(trade.ounces, 2)} oz
                </span>
                <span className="font-mono">
                  {formatCurrency(convert(trade.priceUsd), state.currency)}
                </span>
                <span className="font-mono text-right">
                  {formatCurrency(
                    convert(trade.ounces * trade.priceUsd),
                    state.currency,
                  )}
                </span>
              </div>
              {trade.note && (
                <p className="mt-2 text-xs text-[color:var(--smoke)]">
                  Note: {trade.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
