import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PortfolioPage from "./page";
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

describe("Portfolio page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows calculated totals for the position", () => {
    seedTradingState({ cashUsd: 500, ounces: 10, avgCostUsd: 25 });
    renderWithTrading(<PortfolioPage />);

    expect(screen.getByText("Ounce-based portfolio view")).toBeInTheDocument();
    expect(screen.getByText("$800.00")).toBeInTheDocument();
    expect(screen.getByText("+20.00%")).toBeInTheDocument();
  });

  it("switches the currency display to CAD", async () => {
    seedTradingState({ cashUsd: 500, ounces: 10, avgCostUsd: 25 });
    renderWithTrading(<PortfolioPage />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "CAD" }));

    expect(screen.getByText("CA$1,088.00")).toBeInTheDocument();
  });
});
