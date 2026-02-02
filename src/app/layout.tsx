import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "./AppShell";

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
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
