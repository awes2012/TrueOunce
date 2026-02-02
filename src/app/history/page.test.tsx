import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import HistoryPage from "./page";
import { renderWithTrading, seedTradingState } from "../../test/test-utils";

const mockFeed = vi.hoisted(() => ({
  spotUsd: 30,
  changePct: 2,
  ohlc: { open: 29, high: 31, low: 28, close: 30 },
  history: {
    "1D": [{ label: "09:00", usd: 29 }],
    "1W": [{ label: "Mon", usd: 30 }],
    "1M": [{ label: "W1", usd: 30 }],
    "1Y": [{ label: "Jan", usd: 30 }],
  },
}));

vi.mock("../lib/usePriceFeed", () => ({
  usePriceFeed: () => ({
    feed: mockFeed,
    fxRate: 1.36,
    updatedAt: "2026-01-15T10:00:00.000Z",
  }),
}));

describe("History page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the empty state and disables export when there are no trades", () => {
    renderWithTrading(<HistoryPage />);
    expect(
      screen.getByText(
        "No trades yet. Head to the Trade screen to place a paper order.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export CSV" })).toBeDisabled();
  });

  it("renders trade rows with notes", () => {
    seedTradingState({
      trades: [
        {
          id: "t-1",
          side: "buy",
          ounces: 2,
          priceUsd: 30,
          timestamp: "2026-01-15T10:00:00.000Z",
          note: "first fill",
        },
      ],
    });
    renderWithTrading(<HistoryPage />);

    expect(screen.getByText("BUY")).toBeInTheDocument();
    expect(screen.getByText("$60.00")).toBeInTheDocument();
    expect(screen.getByText("Note: first fill")).toBeInTheDocument();
  });
});
