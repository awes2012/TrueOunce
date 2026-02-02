import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { usePriceFeed } from "./usePriceFeed";
import { priceFeed as fallbackFeed } from "./mock";

const Harness = () => {
  const { feed, fxRate, updatedAt } = usePriceFeed();
  return (
    <div>
      <div data-testid="spot">{feed.spotUsd}</div>
      <div data-testid="fx">{fxRate}</div>
      <div data-testid="updated">{updatedAt}</div>
    </div>
  );
};

describe("usePriceFeed", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("hydrates from the API response", async () => {
    const apiFeed = {
      spotUsd: 42,
      changePct: 1,
      ohlc: { open: 40, high: 44, low: 39, close: 42 },
      history: {
        "1D": [{ label: "09:00", usd: 41 }],
        "1W": [{ label: "Mon", usd: 42 }],
        "1M": [{ label: "W1", usd: 42 }],
        "1Y": [{ label: "Jan", usd: 42 }],
      },
    };
    const payload = {
      priceFeed: apiFeed,
      fxRate: 1.25,
      updatedAt: "2026-01-15T10:00:00.000Z",
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => payload,
      }),
    );

    render(<Harness />);

    await waitFor(() => {
      expect(screen.getByTestId("spot")).toHaveTextContent("42");
    });
    expect(screen.getByTestId("fx")).toHaveTextContent("1.25");
    expect(screen.getByTestId("updated")).toHaveTextContent(
      "2026-01-15T10:00:00.000Z",
    );
  });

  it("keeps the fallback feed when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    render(<Harness />);

    expect(screen.getByTestId("spot")).toHaveTextContent(
      fallbackFeed.spotUsd.toString(),
    );
  });
});
