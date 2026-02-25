import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  // Must be logged in
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const captionId = body?.captionId;
  const direction = body?.direction; // "up" | "down"

  if (!captionId || (direction !== "up" && direction !== "down")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabase.from("caption_votes").insert({
  profile_id: user.id,
  caption_id: captionId,
  vote_value: direction === "up" ? 1 : -1,
  created_datetime_utc: new Date().toISOString(),
  modified_datetime_utc: new Date().toISOString(),
});

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}