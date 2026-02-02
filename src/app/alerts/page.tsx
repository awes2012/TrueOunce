"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency, formatNumber } from "../lib/calc";
import { usePriceFeed } from "../lib/usePriceFeed";
import { useTrading } from "../providers/TradingProvider";

export default function AlertsPage() {
  const { state, addAlert, removeAlert, setCurrency, setFxRate } = useTrading();
  const { feed, fxRate } = usePriceFeed();
  const [type, setType] = useState<"price" | "move">("price");
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [valueInput, setValueInput] = useState("30");

  useEffect(() => {
    setFxRate(fxRate);
  }, [fxRate, setFxRate]);

  const convert = (usd: number) =>
    state.currency === "CAD" ? usd * state.fxRate : usd;

  const helperText = useMemo(() => {
    if (type === "price") {
      return `Alert triggers when silver is ${direction} the target price.`;
    }
    return `Alert triggers when daily move is ${direction} the target percent.`;
  }, [type, direction]);

  const handleCreate = () => {
    const parsed = Number(valueInput);
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    if (type === "price") {
      const priceUsd =
        state.currency === "CAD" ? parsed / state.fxRate : parsed;
      addAlert({ type, direction, priceUsd });
    } else {
      addAlert({ type, direction, movePct: parsed });
    }
    setValueInput(type === "price" ? "30" : "2");
  };

  const isTriggered = (alert: {
    type: "price" | "move";
    direction: "above" | "below";
    priceUsd?: number;
    movePct?: number;
  }) => {
    if (alert.type === "price" && alert.priceUsd) {
      return alert.direction === "above"
        ? feed.spotUsd >= alert.priceUsd
        : feed.spotUsd <= alert.priceUsd;
    }
    if (alert.type === "move" && alert.movePct !== undefined) {
      return alert.direction === "above"
        ? feed.changePct >= alert.movePct
        : feed.changePct <= -alert.movePct;
    }
    return false;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="glass rounded-[32px] p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--smoke)]">
          Alerts
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Set your silver triggers</h1>
        <p className="mt-2 text-sm text-[color:var(--smoke)]">
          Create simple price or % move alerts to stay disciplined.
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
            New alert
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex gap-2">
              {(["price", "move"] as const).map((nextType) => (
                <button
                  key={nextType}
                  onClick={() => {
                    setType(nextType);
                    setValueInput(nextType === "price" ? "30" : "2");
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                    type === nextType
                      ? "bg-[color:var(--ink)] text-[color:var(--paper)]"
                      : "border border-[color:var(--ink)]/10 bg-white/70 text-[color:var(--ink)]"
                  }`}
                >
                  {nextType === "price" ? "Price" : "% Move"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {(["above", "below"] as const).map((nextDirection) => (
                <button
                  key={nextDirection}
                  onClick={() => setDirection(nextDirection)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                    direction === nextDirection
                      ? "bg-[color:var(--ink)] text-[color:var(--paper)]"
                      : "border border-[color:var(--ink)]/10 bg-white/70 text-[color:var(--ink)]"
                  }`}
                >
                  {nextDirection}
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
              <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--smoke)]">
                {type === "price" ? `Target (${state.currency})` : "Target (%)"}
              </label>
              <input
                value={valueInput}
                onChange={(event) => setValueInput(event.target.value)}
                className="mt-2 w-full bg-transparent text-2xl font-semibold outline-none"
                inputMode="decimal"
              />
              <p className="mt-2 text-xs text-[color:var(--smoke)]">
                {helperText}
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="w-full rounded-full bg-[color:var(--vermilion)] px-4 py-3 text-sm font-semibold text-white"
            >
              Add alert
            </button>
          </div>
        </div>

        <div className="glass rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--smoke)]">
            Active alerts
          </p>
          <div className="mt-6 space-y-3 text-sm">
            {state.alerts.length === 0 && (
              <div className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4 text-[color:var(--smoke)]">
                No alerts yet. Add one to stay focused.
              </div>
            )}
            {state.alerts.map((alert) => {
              const triggered = isTriggered(alert);
              const label =
                alert.type === "price"
                  ? `${alert.direction} ${formatCurrency(
                      convert(alert.priceUsd || 0),
                      state.currency,
                    )}`
                  : `${alert.direction} ${formatNumber(alert.movePct || 0, 2)}%`;
              return (
                <div
                  key={alert.id}
                  className="flex items-center justify-between rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {alert.type === "price" ? "Price alert" : "% move alert"}
                    </p>
                    <p className="text-xs text-[color:var(--smoke)]">{label}</p>
                    <p
                      className={`mt-1 text-xs font-semibold ${
                        triggered
                          ? "text-[color:var(--verdigris)]"
                          : "text-[color:var(--smoke)]"
                      }`}
                    >
                      {triggered ? "Triggered" : "Waiting"}
                    </p>
                  </div>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="rounded-full border border-[color:var(--ink)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--smoke)]"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
