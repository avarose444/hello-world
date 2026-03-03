import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <main style={{ padding: 24, maxWidth: 860, margin: "0 auto" }}>
      <h1 style={{ fontSize: 56, marginBottom: 8 }}>AlmostCrackd</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>
        {user ? (
          <>Logged in as <b>{user.email}</b>.</>
        ) : (
          <>You’re not logged in. Please sign in to continue.</>
        )}
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
        {user ? (
          <>
            <Link href="/generate" style={btnPrimary}>
              Generate captions
            </Link>
            <Link href="/captions" style={btn}>
              Rate captions
            </Link>
            <Link href="/list" style={btn}>
              Supabase list
            </Link>
            <Link href="/logout" style={btnDanger}>
              Sign out
            </Link>
          </>
        ) : (
          <Link href="/login" style={btnPrimary}>
            Sign in with Google
          </Link>
        )}
      </div>

      <div style={{ marginTop: 18, opacity: 0.7 }}>
        <p style={{ margin: 0 }}>
          Flow: <b>Generate</b> → <b>Rate</b>
        </p>
      </div>
    </main>
  );
}

const btn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.15)",
  textDecoration: "none",
  display: "inline-block",
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  border: "1px solid rgba(0,0,0,0.15)",
  fontWeight: 600,
};

const btnDanger: React.CSSProperties = {
  ...btn,
  border: "1px solid rgba(0,0,0,0.15)",
};