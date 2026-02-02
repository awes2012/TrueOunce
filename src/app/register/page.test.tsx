import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "./page";

const routerMock = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
}));

const signUpMock = vi.hoisted(() => vi.fn(async () => ({ error: null })));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: signUpMock,
    },
  },
}));

vi.mock("../lib/useSupabaseSession", () => ({
  useSupabaseSession: () => null,
}));

describe("Register page", () => {
  beforeEach(() => {
    routerMock.push.mockReset();
    routerMock.replace.mockReset();
    signUpMock.mockClear();
  });

  it("blocks when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "nope");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(signUpMock).not.toHaveBeenCalled();
    expect(
      screen.getByText("Passwords do not match."),
    ).toBeInTheDocument();
  });

  it("submits a registration request", async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RegisterPage />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(
      screen.getByLabelText("Confirm password"),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(signUpMock).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
      options: {
        emailRedirectTo: "http://localhost/login",
      },
    });
    expect(
      screen.getByText("Check your email to confirm your account."),
    ).toBeInTheDocument();

    vi.runAllTimers();
    expect(routerMock.push).toHaveBeenCalledWith("/login");
    vi.useRealTimers();
  });
});
