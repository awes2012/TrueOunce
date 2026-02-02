import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { AppShell } from "./AppShell";

const sessionMock = vi.hoisted(() => vi.fn(() => null));

vi.mock("next/font/google", () => ({
  Space_Grotesk: () => ({ variable: "space-grotesk" }),
  IBM_Plex_Mono: () => ({ variable: "plex-mono" }),
}));

vi.mock("./lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    },
  },
}));

vi.mock("./lib/useSupabaseSession", () => ({
  useSupabaseSession: () => sessionMock(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("AppShell", () => {
  beforeEach(() => {
    sessionMock.mockReturnValue(null);
  });

  it("renders the brand header and navigation links", () => {
    render(
      <AppShell>
        <div>Inner content</div>
      </AppShell>,
    );

    const brandLink = screen.getByRole("link", { name: /TrueOunce/i });
    expect(brandLink).toHaveAttribute("href", "/");
    expect(screen.getByText("TrueOunce")).toBeInTheDocument();
    expect(
      screen.getByText("Silver-only paper trading"),
    ).toBeInTheDocument();

    const navLinks = [
      { name: "Dashboard", href: "/" },
      { name: "Learn", href: "/learn" },
      { name: "Trade", href: "/trade" },
      { name: "Portfolio", href: "/portfolio" },
      { name: "History", href: "/history" },
      { name: "Alerts", href: "/alerts" },
      { name: "Settings", href: "/settings" },
      { name: "Login", href: "/login" },
      { name: "Register", href: "/register" },
    ];

    navLinks.forEach((link) => {
      const node = screen.getByRole("link", { name: link.name });
      expect(node).toHaveAttribute("href", link.href);
    });
  });

  it("shows account navigation when authenticated", () => {
    sessionMock.mockReturnValue({
      user: { email: "someone@example.com" },
    });

    render(
      <AppShell>
        <div>Inner content</div>
      </AppShell>,
    );

    const accountLink = screen.getByRole("link", { name: "Account" });
    expect(accountLink).toHaveAttribute("href", "/account");
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });

  it("renders children within the layout shell", () => {
    render(
      <AppShell>
        <div>Layout child</div>
      </AppShell>,
    );

    expect(screen.getByText("Layout child")).toBeInTheDocument();
  });
});
