"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatNumber } from "./lib/calc";
import { lessons } from "./lib/lessons";
import { useLessonProgress } from "./lib/lessonProgress";
import { getNextLessonSlug } from "./lib/nextLesson";
import { useTrading } from "./providers/TradingProvider";
import { usePriceFeed } from "./lib/usePriceFeed";

const timeframes = ["1D", "1W", "1M", "1Y"] as const;

export default function Home() {
  const { state, setCurrency, setFxRate } = useTrading();
  const { map, completedCount } = useLessonProgress();
  const nextLessonSlug = useMemo(() => getNextLessonSlug(map), [map]);
  const [timeframe, setTimeframe] = useState<(typeof timeframes)[number]>("1W");
  const { feed, fxRate } = usePriceFeed();

  useEffect(() => {
    setFxRate(fxRate);
  }, [fxRate, setFxRate]);

  const { spotUsd, changePct, ohlc } = feed;
  const convert = (usd: number) =>
    state.currency === "CAD" ? usd * state.fxRate : usd;

  const chartPoints = useMemo(
    () => feed.history[timeframe].map((point) => convert(point.usd)),
    [feed, timeframe, state.currency, state.fxRate],
  );

  const chartWidth = 360;
  const chartHeight = 120;
  const chartPadding = 6;
  const min = Math.min(...chartPoints);
  const max = Math.max(...chartPoints);
  const range = max - min || 1;
  const chartPath = chartPoints
    .map((point, index) => {
      const x =
        (index / (chartPoints.length - 1)) * (chartWidth - chartPadding * 2) +
        chartPadding;
      const y =
        chartHeight -
        ((point - min) / range) * (chartHeight - chartPadding * 2) -
        chartPadding;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPath = `${chartPath} L ${chartWidth - chartPadding} ${
    chartHeight - chartPadding
  } L ${chartPadding} ${chartHeight - chartPadding} Z`;

  return (
    <div className="flex flex-col gap-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass rounded-[32px] p-8">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--smoke)]">
            Live silver spot
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Trade only silver. Build discipline.
          </h1>
          <p className="text-balance mt-4 max-w-xl text-base text-[color:var(--smoke)] sm:text-lg">
            Track XAG, simulate trades, and keep your portfolio ounce-focused
            without distractions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {(["USD", "CAD"] as const).map((currency) => (
              <button
                key={currency}
                onClick={() => setCurrency(currency)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  state.currency === currency
                    ? "border-transparent bg-[color:var(--ink)] text-[color:var(--paper)]"
                    : "border-[color:var(--ink)]/15 bg-white/70 text-[color:var(--ink)]"
                }`}
              >
                {currency}
              </button>
            ))}
            <span className="flex items-center rounded-full border border-[color:var(--ink)]/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--smoke)]">
              FX 1 USD = {formatNumber(state.fxRate, 2)} CAD
            </span>
          </div>
        </div>

        <div className="glass rounded-[32px] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[color:var(--smoke)]">
                XAG / {state.currency}
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {formatCurrency(convert(spotUsd), state.currency)}
              </p>
              <p className="mt-1 text-sm text-[color:var(--verdigris)]">
                +{formatNumber(changePct, 2)}% today
              </p>
            </div>
            <div className="flex gap-2">
              {timeframes.map((frame) => (
                <button
                  key={frame}
                  onClick={() => setTimeframe(frame)}
                  className={`rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                    timeframe === frame
                      ? "bg-[color:var(--ink)] text-[color:var(--paper)]"
                      : "border border-[color:var(--ink)]/10 bg-white/70 text-[color:var(--ink)]"
                  }`}
                >
                  {frame}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-32 w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="silverGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c26c3a" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#c26c3a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#silverGlow)" />
              <path
                d={chartPath}
                fill="none"
                stroke="#161616"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Open", ohlc.open],
              ["High", ohlc.high],
              ["Low", ohlc.low],
              ["Close", ohlc.close],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[color:var(--smoke)]">{label}</p>
                <p className="font-mono">
                  {formatCurrency(convert(Number(value)), state.currency)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="glass rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--smoke)]">
            What you can do next
          </p>
          <p className="mt-2 text-2xl font-semibold">Pick a focused workflow</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href={nextLessonSlug ? `/learn/${nextLessonSlug}` : "/learn"}
              className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4 transition hover:bg-[color:var(--steel)]"
            >
              <p className="text-sm font-semibold">
                {nextLessonSlug ? "Continue learning" : "All lessons complete"}
              </p>
              <p className="mt-2 text-sm text-[color:var(--smoke)]">
                {completedCount}/{lessons.length} lessons complete.
                {nextLessonSlug ? " Jump into the next lesson." : " Review anything anytime."}
              </p>
            </Link>
            {[
              {
                href: "/trade",
                title: "Simulate a trade",
                body: "Practice buy/sell decisions with zero real-money risk.",
              },
              {
                href: "/portfolio",
                title: "Review portfolio",
                body: "Track ounces held, average cost, and total return.",
              },
              {
                href: "/history",
                title: "Audit history",
                body: "Every order logged with notes for discipline.",
              },
              {
                href: "/alerts",
                title: "Set alerts",
                body: "Get notified when silver hits your levels.",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4 transition hover:bg-[color:var(--steel)]"
              >
                <p className="text-sm font-semibold">{card.title}</p>
                <p className="mt-2 text-sm text-[color:var(--smoke)]">
                  {card.body}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--smoke)]">
            Discipline checklist
          </p>
          <p className="mt-2 text-2xl font-semibold">Simple guardrails</p>
          <div className="mt-6 grid gap-4">
            {[
              {
                title: "Daily trade limit",
                detail: "Max 5 orders.",
              },
              {
                title: "Max position alert",
                detail: "Warning at 120 oz.",
              },
              {
                title: "Cooling off switch",
                detail: "Pause trading for 24h.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4"
              >
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-[color:var(--smoke)]">
                    {item.detail}
                  </p>
                </div>
                <span className="rounded-full bg-[color:var(--steel)] px-3 py-1 text-xs font-semibold">
                  Enabled
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
