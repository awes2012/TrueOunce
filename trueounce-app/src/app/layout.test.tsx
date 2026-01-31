import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import RootLayout from "./layout";

vi.mock("next/font/google", () => ({
  Space_Grotesk: () => ({ variable: "space-grotesk" }),
  IBM_Plex_Mono: () => ({ variable: "plex-mono" }),
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

describe("RootLayout", () => {
  it("renders the brand header and navigation links", () => {
    render(
      <RootLayout>
        <div>Inner content</div>
      </RootLayout>,
    );

    expect(screen.getByText("TrueOunce")).toBeInTheDocument();
    expect(
      screen.getByText("Silver-only paper trading"),
    ).toBeInTheDocument();

    const navLinks = [
      { name: "Dashboard", href: "/" },
      { name: "Trade", href: "/trade" },
      { name: "Portfolio", href: "/portfolio" },
      { name: "History", href: "/history" },
      { name: "Alerts", href: "/alerts" },
      { name: "Settings", href: "/settings" },
    ];

    navLinks.forEach((link) => {
      const node = screen.getByRole("link", { name: link.name });
      expect(node).toHaveAttribute("href", link.href);
    });
  });

  it("renders children within the layout shell", () => {
    render(
      <RootLayout>
        <div>Layout child</div>
      </RootLayout>,
    );

    expect(screen.getByText("Layout child")).toBeInTheDocument();
  });
});
