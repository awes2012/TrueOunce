"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "../lib/calc";
import { usePriceFeed } from "../lib/usePriceFeed";
import { useTrading } from "../providers/TradingProvider";

export default function SettingsPage() {
  const {
    state,
    setCurrency,
    setDailyTradeLimit,
    toggleCoolingOff,
    setMaxPositionOz,
    setFxRate,
  } = useTrading();
  const { fxRate } = usePriceFeed();
  const [dailyLimitInput, setDailyLimitInput] = useState(
    state.dailyTradeLimit.toString(),
  );
  const [maxPositionInput, setMaxPositionInput] = useState(
    state.maxPositionOz.toString(),
  );

  useEffect(() => {
    setFxRate(fxRate);
  }, [fxRate, setFxRate]);

  useEffect(() => {
    setDailyLimitInput(state.dailyTradeLimit.toString());
  }, [state.dailyTradeLimit]);

  useEffect(() => {
    setMaxPositionInput(state.maxPositionOz.toString());
  }, [state.maxPositionOz]);

  const handleLimitBlur = () => {
    const next = Number(dailyLimitInput);
    if (Number.isFinite(next) && next > 0) {
      setDailyTradeLimit(next);
    }
  };

  const handleMaxPositionBlur = () => {
    const next = Number(maxPositionInput);
    if (Number.isFinite(next) && next > 0) {
      setMaxPositionOz(next);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="glass rounded-[32px] p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--smoke)]">
          Settings
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Guardrails & controls</h1>
        <p className="mt-2 text-sm text-[color:var(--smoke)]">
          Tune your discipline rules without leaving the cockpit.
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
            Trading limits
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
              <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--smoke)]">
                Daily trade limit
              </label>
              <input
                value={dailyLimitInput}
                onChange={(event) => setDailyLimitInput(event.target.value)}
                onBlur={handleLimitBlur}
                className="mt-2 w-full bg-transparent text-2xl font-semibold outline-none"
                inputMode="numeric"
              />
              <p className="mt-2 text-xs text-[color:var(--smoke)]">
                Current limit: {formatNumber(state.dailyTradeLimit, 0)} orders
                per day.
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
              <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--smoke)]">
                Max position warning (oz)
              </label>
              <input
                value={maxPositionInput}
                onChange={(event) => setMaxPositionInput(event.target.value)}
                onBlur={handleMaxPositionBlur}
                className="mt-2 w-full bg-transparent text-2xl font-semibold outline-none"
                inputMode="decimal"
              />
              <p className="mt-2 text-xs text-[color:var(--smoke)]">
                Alert when your position crosses {formatNumber(state.maxPositionOz, 0)}{" "}
                oz.
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--smoke)]">
            Cooling off
          </p>
          <div className="mt-6 rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Pause trading</p>
                <p className="text-xs text-[color:var(--smoke)]">
                  Temporarily disable order entry.
                </p>
              </div>
              <button
                onClick={toggleCoolingOff}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                  state.coolingOff
                    ? "bg-[color:var(--vermilion)] text-white"
                    : "bg-[color:var(--steel)] text-[color:var(--ink)]"
                }`}
              >
                {state.coolingOff ? "On" : "Off"}
              </button>
            </div>
            <p className="mt-3 text-xs text-[color:var(--smoke)]">
              Cooling off is currently {state.coolingOff ? "enabled" : "disabled"}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
