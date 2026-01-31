"use client";

import { useEffect, useMemo, useState } from "react";
import { calcRiskPreview, formatCurrency, formatNumber } from "../lib/calc";
import { usePriceFeed } from "../lib/usePriceFeed";
import { useTrading } from "../providers/TradingProvider";

const isSameDay = (left: string, right: Date) =>
  new Date(left).toDateString() === right.toDateString();

export default function TradePage() {
  const { state, executeTrade, setCurrency, setFxRate } = useTrading();
  const { feed, fxRate } = usePriceFeed();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [ouncesInput, setOuncesInput] = useState("10");
  const [note, setNote] = useState("");

  useEffect(() => {
    setFxRate(fxRate);
  }, [fxRate, setFxRate]);

  const parsedOunces = Number(ouncesInput);
  const hasValidOunces = Number.isFinite(parsedOunces) && parsedOunces > 0;
  const ounces = hasValidOunces ? parsedOunces : 0;
  const spotUsd = feed.spotUsd;
  const convert = (usd: number) =>
    state.currency === "CAD" ? usd * state.fxRate : usd;

  const estimatedCost = hasValidOunces ? ounces * spotUsd : 0;
  const cashAfter =
    side === "buy" ? state.cashUsd - estimatedCost : state.cashUsd + estimatedCost;

  const maxSell = state.ounces;
  const canSell = hasValidOunces && ounces <= maxSell;
  const canBuy = hasValidOunces && estimatedCost <= state.cashUsd;
  const tradesToday = state.trades.filter((trade) =>
    isSameDay(trade.timestamp, new Date()),
  ).length;
  const tradesRemaining = Math.max(state.dailyTradeLimit - tradesToday, 0);
  const withinDailyLimit = tradesRemaining > 0;
  const coolingBlocked = state.coolingOff;
  const canSubmit =
    (side === "buy" ? canBuy : canSell) && withinDailyLimit && !coolingBlocked;

  const projectedOunces =
    side === "buy" ? state.ounces + ounces : Math.max(state.ounces - ounces, 0);
  const exceedsMaxPosition =
    hasValidOunces && projectedOunces > state.maxPositionOz;

  const riskPreview = useMemo(
    () => calcRiskPreview(ounces || 0, spotUsd, 3),
    [ounces, spotUsd],
  );

  const handleSubmit = () => {
    if (!canSubmit) return;
    executeTrade(side, ounces, spotUsd, note.trim() || undefined);
    setNote("");
    setOuncesInput("10");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="glass rounded-[32px] p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--smoke)]">
          Paper trade
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Buy or sell silver</h1>
        <p className="mt-2 text-sm text-[color:var(--smoke)]">
          Market orders only. Trades update your paper portfolio instantly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setSide("buy")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                side === "buy"
                  ? "bg-[color:var(--ink)] text-[color:var(--paper)]"
                  : "border border-[color:var(--ink)]/10 bg-white/70 text-[color:var(--ink)]"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setSide("sell")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                side === "sell"
                  ? "bg-[color:var(--ink)] text-[color:var(--paper)]"
                  : "border border-[color:var(--ink)]/10 bg-white/70 text-[color:var(--ink)]"
              }`}
            >
              Sell
            </button>
          </div>
          <div className="flex gap-2">
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
          <span className="rounded-full border border-[color:var(--ink)]/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--smoke)]">
            XAG / {state.currency}
          </span>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--smoke)]">
            Order ticket
          </p>
          <div className="mt-6 rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
            <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--smoke)]">
              Ounces
            </label>
            <input
              value={ouncesInput}
              onChange={(event) => setOuncesInput(event.target.value)}
              className="mt-2 w-full bg-transparent text-3xl font-semibold outline-none"
              inputMode="decimal"
            />
          </div>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[color:var(--smoke)]">Price per oz</span>
            <span className="font-mono">
                {formatCurrency(convert(spotUsd), state.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[color:var(--smoke)]">Estimated {side}</span>
              <span className="font-mono">
                {formatCurrency(convert(estimatedCost), state.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[color:var(--smoke)]">Cash after</span>
              <span className="font-mono">
                {formatCurrency(convert(cashAfter), state.currency)}
              </span>
            </div>
          </div>
          {!canSubmit && (
            <p className="mt-3 text-xs text-[color:var(--vermilion)]">
              {!withinDailyLimit
                ? "Daily trade limit reached."
                : coolingBlocked
                  ? "Cooling off is enabled. Disable it in Settings to trade."
                  : side === "buy"
                    ? "Not enough cash for this buy."
                    : "Not enough ounces to sell."}
            </p>
          )}
          {exceedsMaxPosition && (
            <p className="mt-2 text-xs text-[color:var(--vermilion)]">
              Warning: this trade exceeds your max position of{" "}
              {formatNumber(state.maxPositionOz, 0)} oz.
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="mt-6 w-full rounded-full bg-[color:var(--vermilion)] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Confirm {side}
          </button>
          <p className="mt-3 text-xs text-[color:var(--smoke)]">
            Daily trades remaining: {tradesRemaining} / {state.dailyTradeLimit}
          </p>
        </div>

        <div className="glass rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--smoke)]">
            Risk preview
          </p>
          <p className="mt-2 text-2xl font-semibold">What if silver moves 3%?</p>
          <div className="mt-6 rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[color:var(--smoke)]">Position value</span>
              <span className="font-mono">
                {formatCurrency(convert(riskPreview.before), state.currency)}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-[color:var(--smoke)]">After move</span>
              <span className="font-mono">
                {formatCurrency(convert(riskPreview.after), state.currency)}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-[color:var(--smoke)]">Change</span>
              <span
                className={`font-mono ${
                  riskPreview.change >= 0
                    ? "text-[color:var(--verdigris)]"
                    : "text-[color:var(--vermilion)]"
                }`}
              >
                {formatCurrency(convert(riskPreview.change), state.currency)}
              </span>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
            <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--smoke)]">
              Trade note (optional)
            </label>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="e.g. added on dip"
              className="mt-2 w-full bg-transparent text-sm font-semibold outline-none"
              maxLength={80}
            />
            <p className="mt-2 text-xs text-[color:var(--smoke)]">
              {note.length}/80
            </p>
          </div>
          <div className="mt-4 rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4 text-sm">
            <p className="font-semibold">Guardrails</p>
            <p className="mt-2 text-[color:var(--smoke)]">
              Max position warning at {formatNumber(120, 0)} oz. Cooling off
              toggle available in settings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
