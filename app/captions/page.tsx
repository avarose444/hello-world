import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import CaptionCards from "./CaptionCards";

export default async function CaptionsPage() {
  const supabase = await createSupabaseServerClient();

  // Require auth
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  // Load captions
  const { data: captions, error } = await supabase
    .from("captions")
    .select("*")
    .limit(50);

  if (error) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Captions</h1>
        <p style={{ color: "crimson" }}>Error loading captions: {error.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Rate Captions</h1>
      <p>Only logged-in users can vote.</p>
      <CaptionCards captions={captions ?? []} />
    </main>
  );
}