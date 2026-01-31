import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsPage from "./page";
import { renderWithTrading } from "../../test/test-utils";

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

describe("Settings page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("updates daily trade limit and max position values", async () => {
    renderWithTrading(<SettingsPage />);

    const user = userEvent.setup();
    const dailyInput = screen.getByDisplayValue("5");
    await user.clear(dailyInput);
    await user.type(dailyInput, "8");
    fireEvent.blur(dailyInput);

    const maxInput = screen.getByDisplayValue("120");
    await user.clear(maxInput);
    await user.type(maxInput, "200");
    fireEvent.blur(maxInput);

    expect(
      screen.getByText("Current limit: 8 orders per day."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Alert when your position crosses 200 oz."),
    ).toBeInTheDocument();
  });

  it("toggles cooling off on and off", async () => {
    renderWithTrading(<SettingsPage />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Off" }));

    expect(screen.getByRole("button", { name: "On" })).toBeInTheDocument();
    expect(
      screen.getByText("Cooling off is currently enabled."),
    ).toBeInTheDocument();
  });
});
