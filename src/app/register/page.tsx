"use client";

import { useState } from "react";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function RegisterPage() {
  const supabase = getSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await supabase.auth.signUp({
      email,
      password,
    });
  };

  return (
    <div>
      <h1>Register</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={register}>Create account</button>
    </div>
  );
}
