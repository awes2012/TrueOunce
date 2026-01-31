"use client";

import { useEffect, useState } from "react";
import type { PriceFeed } from "./types";
import { priceFeed as fallbackFeed } from "./mock";

type PriceResponse = {
  priceFeed: PriceFeed;
  fxRate: number;
  updatedAt: string;
};

export const usePriceFeed = () => {
  const [feed, setFeed] = useState<PriceFeed>(fallbackFeed);
  const [fxRate, setFxRate] = useState(1.36);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/price", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as PriceResponse;
        if (!active) return;
        setFeed(data.priceFeed);
        setFxRate(data.fxRate);
        setUpdatedAt(data.updatedAt);
      } catch {
        // Keep fallback feed when offline.
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return { feed, fxRate, updatedAt };
};
