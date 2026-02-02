"use client";

import { ReactNode } from "react";
import { useSupabaseSession } from "./lib/useSupabaseSession";

export default function AppShell({ children }: { children: ReactNode }) {
  const session = useSupabaseSession();

  return (
    <div>
      <header>
        <strong>TrueOunce</strong>
        {session ? <span>Logged in</span> : <span>Guest</span>}
      </header>
      <main>{children}</main>
    </div>
  );
}
