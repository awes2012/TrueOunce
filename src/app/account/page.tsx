"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) return <p>Loading…</p>;

  return (
    <div>
      <h1>Account</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
