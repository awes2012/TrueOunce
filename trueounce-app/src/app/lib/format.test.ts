import { describe, expect, it } from "vitest";
import { formatCurrency, formatNumber } from "./calc";

describe("formatCurrency", () => {
  it("formats USD values with two decimals", () => {
    expect(formatCurrency(1234.5, "USD")).toBe("$1,234.50");
  });

  it("formats CAD values with the CAD prefix", () => {
    expect(formatCurrency(1234.5, "CAD")).toBe("CA$1,234.50");
  });
});

describe("formatNumber", () => {
  it("pads to the requested precision", () => {
    expect(formatNumber(1.2, 2)).toBe("1.20");
  });

  it("allows zero digits", () => {
    expect(formatNumber(12.8, 0)).toBe("13");
  });
});
