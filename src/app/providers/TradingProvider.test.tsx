import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TradingProvider, useTrading } from "./TradingProvider";

const STORAGE_KEY = "trueounce-trading-state";

const Harness = () => {
  const { state, setCurrency, executeTrade } = useTrading();
  return (
    <div>
      <div data-testid="currency">{state.currency}</div>
      <div data-testid="cash">{state.cashUsd}</div>
      <div data-testid="ounces">{state.ounces}</div>
      <button onClick={() => setCurrency("CAD")}>Set CAD</button>
      <button onClick={() => executeTrade("buy", 2, 50)}>Buy 2</button>
    </div>
  );
};

describe("TradingProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("hydrates state from localStorage", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currency: "CAD",
        fxRate: 1.36,
        cashUsd: 9000,
        ounces: 5,
        avgCostUsd: 20,
        trades: [],
        dailyTradeLimit: 5,
        coolingOff: false,
        maxPositionOz: 120,
        alerts: [],
      }),
    );

    render(
      <TradingProvider>
        <Harness />
      </TradingProvider>,
    );

    expect(screen.getByTestId("currency")).toHaveTextContent("CAD");
    expect(screen.getByTestId("cash")).toHaveTextContent("9000");
    expect(screen.getByTestId("ounces")).toHaveTextContent("5");
  });

  it("executes trades and persists updates", async () => {
    render(
      <TradingProvider>
        <Harness />
      </TradingProvider>,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Buy 2" }));
    await user.click(screen.getByRole("button", { name: "Set CAD" }));

    expect(screen.getByTestId("ounces")).toHaveTextContent("2");
    expect(screen.getByTestId("cash")).toHaveTextContent("9900");

    const stored = window.localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    expect(stored).toContain("\"currency\":\"CAD\"");
  });
});
