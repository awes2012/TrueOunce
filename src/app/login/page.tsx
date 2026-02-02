"use client";

import { getSupabaseClient } from "../lib/supabaseClient";

export default function LoginPage() {
  const supabase = getSupabaseClient();

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}
