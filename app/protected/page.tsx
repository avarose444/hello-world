import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login");

  return (
    <main style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>Dashboard</h1>

      <p style={{ opacity: 0.8 }}>
        Logged in as <b>{user.email}</b>
      </p>

      <hr style={{ margin: "24px 0" }} />

      <h2 style={{ marginBottom: 12 }}>Workflow</h2>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Link href="/generate" style={card}>
          <h3>Step 1: Generate</h3>
          <p>Upload an image and generate captions.</p>
        </Link>

        <Link href="/captions" style={card}>
          <h3>Step 2: Rate</h3>
          <p>Vote on generated captions.</p>
        </Link>

        <Link href="/list" style={card}>
          <h3>Supabase List</h3>
          <p>View database records.</p>
        </Link>
      </div>

      <div style={{ marginTop: 32 }}>
        <Link href="/logout" style={logoutBtn}>
          Sign out
        </Link>
      </div>
    </main>
  );
}

const card: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 14,
  padding: 18,
  width: 250,
  textDecoration: "none",
  color: "inherit",
  transition: "0.2s ease",
};

const logoutBtn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ccc",
  textDecoration: "none",
};