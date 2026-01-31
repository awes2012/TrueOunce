import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";
import { renderWithTrading } from "../test/test-utils";

const mockFeed = vi.hoisted(() => ({
  spotUsd: 30,
  changePct: 1.5,
  ohlc: { open: 29, high: 31, low: 28, close: 30 },
  history: {
    "1D": [
      { label: "09:00", usd: 29 },
      { label: "10:00", usd: 30 },
    ],
    "1W": [
      { label: "Mon", usd: 27 },
      { label: "Tue", usd: 30 },
    ],
    "1M": [
      { label: "W1", usd: 26 },
      { label: "W2", usd: 29 },
    ],
    "1Y": [
      { label: "Jan", usd: 22 },
      { label: "Feb", usd: 30 },
    ],
  },
}));

vi.mock("./lib/usePriceFeed", () => ({
  usePriceFeed: () => ({
    feed: mockFeed,
    fxRate: 1.36,
    updatedAt: "2026-01-15T10:00:00.000Z",
  }),
}));

describe("Home page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the timeframe controls", () => {
    renderWithTrading(<Home />);
    expect(screen.getByRole("button", { name: "1D" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1W" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1M" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1Y" })).toBeInTheDocument();
  });

  it("toggles the currency selection", async () => {
    renderWithTrading(<Home />);
    expect(screen.getByText("XAG / USD")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "CAD" }));

    expect(screen.getByText("XAG / CAD")).toBeInTheDocument();
  });
});
