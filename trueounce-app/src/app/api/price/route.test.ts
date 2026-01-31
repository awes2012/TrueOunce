// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { priceFeed } from "../../lib/mock";
import { GET } from "./route";

describe("GET /api/price", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the mock price feed and metadata", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T10:00:00.000Z"));

    const response = await GET();
    expect(response.status).toBe(200);

    const payload = await response.json();
    expect(payload).toEqual({
      priceFeed,
      fxRate: 1.36,
      updatedAt: "2026-01-15T10:00:00.000Z",
    });
  });
});
