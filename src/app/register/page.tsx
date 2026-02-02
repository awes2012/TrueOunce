"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { useSupabaseSession } from "../lib/useSupabaseSession";

export default function RegisterPage() {
  const router = useRouter();
  const session = useSupabaseSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user) {
      router.replace("/");
    }
  }, [session?.user, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (password !== confirm) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setMessage("Check your email to confirm your account.");
    setTimeout(() => router.push("/login"), 1200);
  };

  return (
    <div className="mx-auto w-full max-w-lg glass rounded-[32px] p-8">
      <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--smoke)]">
        Register
      </p>
      <h1 className="mt-3 text-3xl font-semibold">Create your account</h1>
      <p className="mt-2 text-sm text-[color:var(--smoke)]">
        Use your email to start tracking silver trades.
      </p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--smoke)]">
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 px-4 py-3 text-sm font-semibold text-[color:var(--ink)] outline-none"
            required
          />
        </label>
        <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--smoke)]">
          Password
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 px-4 py-3 text-sm font-semibold text-[color:var(--ink)] outline-none"
            required
            minLength={6}
          />
        </label>
        <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--smoke)]">
          Confirm password
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 px-4 py-3 text-sm font-semibold text-[color:var(--ink)] outline-none"
            required
            minLength={6}
          />
        </label>

        {status === "error" ? (
          <p className="text-sm text-[color:var(--vermilion)]">{message}</p>
        ) : null}
        {status === "success" ? (
          <p className="text-sm text-[color:var(--verdigris)]">{message}</p>
        ) : null}

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-[color:var(--ink)] px-4 py-3 text-sm font-semibold text-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
