import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";

const routerMock = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
}));

const signInMock = vi.hoisted(() => vi.fn(async () => ({ error: null })));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: signInMock,
    },
  },
}));

vi.mock("../lib/useSupabaseSession", () => ({
  useSupabaseSession: () => null,
}));

describe("Login page", () => {
  beforeEach(() => {
    routerMock.push.mockReset();
    routerMock.replace.mockReset();
    signInMock.mockClear();
  });

  it("submits email and password", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(signInMock).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
    expect(routerMock.push).toHaveBeenCalledWith("/");
  });
});
