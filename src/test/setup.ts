import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Prevent next/font from doing any runtime work during tests.
vi.mock("next/font/google", () => ({
  IBM_Plex_Mono: () => ({ variable: "" }),
  Space_Grotesk: () => ({ variable: "" }),
}));

afterEach(() => {
  cleanup();
});
