"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  async function signIn() {
    const supabase = createSupabaseBrowserClient();
    const origin = window.location.origin;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>
      <button onClick={signIn} style={{ padding: 12 }}>
        Sign in with Google
      </button>
    </main>
  );
}