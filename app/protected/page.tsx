import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main style={{ padding: 24 }}>
      <h1>Protected Page</h1>
      <p>Gated UI ✅</p>
      <p>Email: {user.email}</p>
      <p>
  <a href="/logout">Sign out</a>
</p>
    </main>
  );
}
