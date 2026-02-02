"use client";

import Link from "next/link";
import { TradingProvider } from "./providers/TradingProvider";
import { supabase } from "./lib/supabaseClient";
import { useSupabaseSession } from "./lib/useSupabaseSession";

export function AppShell({ children }: { children: React.ReactNode }) {
  const session = useSupabaseSession();
  const isAuthed = Boolean(session?.user);

  const authLinks = isAuthed
    ? [{ href: "/account", label: "Account" }]
    : [
        { href: "/login", label: "Login" },
        { href: "/register", label: "Register" },
      ];

  return (
    <TradingProvider>
      <div className="min-h-screen px-6 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--ink)] text-[color:var(--paper)]">
                <span className="text-lg font-semibold">TO</span>
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight">TrueOunce</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--smoke)]">
                  Silver-only paper trading
                </p>
              </div>
            </Link>
            <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
              {[
                { href: "/", label: "Dashboard" },
                { href: "/learn", label: "Learn" },
                { href: "/trade", label: "Trade" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/history", label: "History" },
                { href: "/alerts", label: "Alerts" },
                { href: "/settings", label: "Settings" },
                ...authLinks,
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-[color:var(--ink)]/15 bg-white/70 px-4 py-2 text-[color:var(--ink)] transition hover:bg-[color:var(--steel)]"
                >
                  {link.label}
                </Link>
              ))}
              {isAuthed ? (
                <button
                  type="button"
                  onClick={async () => {
                    await supabase.auth.signOut();
                  }}
                  className="rounded-full border border-[color:var(--ink)]/15 bg-white/70 px-4 py-2 text-[color:var(--ink)] transition hover:bg-[color:var(--steel)]"
                >
                  Sign out
                </button>
              ) : null}
            </nav>
          </header>
          {children}
        </div>
      </div>
    </TradingProvider>
  );
}
