import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AlertsPage from "./page";
import { renderWithTrading } from "../../test/test-utils";

const mockFeed = vi.hoisted(() => ({
  spotUsd: 29.84,
  changePct: 0.86,
  ohlc: { open: 29.12, high: 30.34, low: 28.66, close: 29.84 },
  history: {
    "1D": [{ label: "09:00", usd: 29.12 }],
    "1W": [{ label: "Mon", usd: 29.84 }],
    "1M": [{ label: "W1", usd: 29.84 }],
    "1Y": [{ label: "Jan", usd: 29.84 }],
  },
}));

vi.mock("../lib/usePriceFeed", () => ({
  usePriceFeed: () => ({
    feed: mockFeed,
    fxRate: 1.36,
    updatedAt: "2026-01-15T10:00:00.000Z",
  }),
}));

describe("Alerts page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("creates and removes a price alert", async () => {
    renderWithTrading(<AlertsPage />);

    expect(screen.getByText("No alerts yet. Add one to stay focused.")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Add alert" }));

    expect(screen.getByText("Price alert")).toBeInTheDocument();
    expect(screen.getByText("above $30.00")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(screen.getByText("No alerts yet. Add one to stay focused.")).toBeInTheDocument();
  });

  it("switches to percent move alerts", async () => {
    renderWithTrading(<AlertsPage />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "% Move" }));
    await user.click(screen.getByRole("button", { name: "below" }));

    const targetInput = screen.getByDisplayValue("2");
    await user.clear(targetInput);
    await user.type(targetInput, "1.5");
    await user.click(screen.getByRole("button", { name: "Add alert" }));

    expect(screen.getByText("% move alert")).toBeInTheDocument();
    expect(screen.getByText("below 1.50%")).toBeInTheDocument();
  });
});
