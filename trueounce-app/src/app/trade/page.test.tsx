import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TradePage from "./page";
import { renderWithTrading, seedTradingState } from "../../test/test-utils";

const mockFeed = vi.hoisted(() => ({
  spotUsd: 50,
  changePct: 1,
  ohlc: { open: 49, high: 51, low: 48, close: 50 },
  history: {
    "1D": [
      { label: "09:00", usd: 49 },
      { label: "10:00", usd: 50 },
    ],
    "1W": [
      { label: "Mon", usd: 45 },
      { label: "Tue", usd: 50 },
    ],
    "1M": [
      { label: "W1", usd: 40 },
      { label: "W2", usd: 50 },
    ],
    "1Y": [
      { label: "Jan", usd: 30 },
      { label: "Feb", usd: 50 },
    ],
  },
}));

vi.mock("../lib/usePriceFeed", () => ({
  usePriceFeed: () => ({
    feed: mockFeed,
    fxRate: 1.36,
    updatedAt: "2026-01-15T10:00:00.000Z",
  }),
}));

describe("Trade page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("switches between buy and sell modes", async () => {
    renderWithTrading(<TradePage />);
    expect(screen.getByText("Estimated buy")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Sell" }));

    expect(screen.getByText("Estimated sell")).toBeInTheDocument();
  });

  it("shows an error when cash is insufficient", async () => {
    seedTradingState({ cashUsd: 100 });
    renderWithTrading(<TradePage />);

    const user = userEvent.setup();
    const ouncesInput = screen.getByDisplayValue("10");
    await user.clear(ouncesInput);
    await user.type(ouncesInput, "10");

    expect(
      screen.getByText("Not enough cash for this buy."),
    ).toBeInTheDocument();
  });

  it("updates remaining trades after a confirmed order", async () => {
    renderWithTrading(<TradePage />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Confirm buy" }));

    expect(
      screen.getByText("Daily trades remaining: 4 / 5"),
    ).toBeInTheDocument();
  });

  it("blocks trading when cooling off is enabled", () => {
    seedTradingState({ coolingOff: true });
    renderWithTrading(<TradePage />);

    expect(
      screen.getByText(
        "Cooling off is enabled. Disable it in Settings to trade.",
      ),
    ).toBeInTheDocument();
  });
});
