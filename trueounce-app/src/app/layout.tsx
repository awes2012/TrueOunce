import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { TradingProvider } from "./providers/TradingProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "TrueOunce — Silver Paper Trading",
  description: "Silver-only paper trading with a disciplined portfolio view.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${plexMono.variable} antialiased`}>
        <TradingProvider>
          <div className="min-h-screen px-6 py-8 sm:px-10 lg:px-16">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
              <header className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--ink)] text-[color:var(--paper)]">
                    <span className="text-lg font-semibold">TO</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold tracking-tight">TrueOunce</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--smoke)]">
                      Silver-only paper trading
                    </p>
                  </div>
                </div>
                <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                  {[
                    { href: "/", label: "Dashboard" },
                    { href: "/trade", label: "Trade" },
                    { href: "/portfolio", label: "Portfolio" },
                    { href: "/history", label: "History" },
                    { href: "/alerts", label: "Alerts" },
                    { href: "/settings", label: "Settings" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-[color:var(--ink)]/15 bg-white/70 px-4 py-2 text-[color:var(--ink)] transition hover:bg-[color:var(--steel)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </header>
              {children}
            </div>
          </div>
        </TradingProvider>
      </body>
    </html>
  );
}
