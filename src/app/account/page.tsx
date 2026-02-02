"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { useSupabaseSession } from "../lib/useSupabaseSession";

export default function AccountPage() {
  const router = useRouter();
  const session = useSupabaseSession();

  useEffect(() => {
    if (!session?.user) {
      router.replace("/login");
    }
  }, [session?.user, router]);

  return (
    <div className="mx-auto w-full max-w-xl glass rounded-[32px] p-8">
      <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--smoke)]">
        Account
      </p>
      <h1 className="mt-3 text-3xl font-semibold">Account settings</h1>
      <p className="mt-2 text-sm text-[color:var(--smoke)]">
        Logged in as <span className="font-semibold">{session?.user?.email}</span>
      </p>

      <button
        type="button"
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/");
        }}
        className="mt-6 rounded-full border border-[color:var(--ink)]/15 bg-white/70 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:bg-[color:var(--steel)]"
      >
        Sign out
      </button>
    </div>
  );
}
