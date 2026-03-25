import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const captionId = body?.captionId;
  const direction = body?.direction;

  if (!captionId || (direction !== "up" && direction !== "down")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // In many Supabase setups, profiles.id matches auth.users.id
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: `Profile lookup failed: ${profileError?.message ?? "Profile not found"}` },
      { status: 400 }
    );
  }

  const profileId = profile.id;

  const { error } = await supabase
    .from("caption_votes")
    .upsert(
      {
        caption_id: captionId,
        user_id: user.id,
        profile_id: profileId,
        vote_value: direction === "up" ? 1 : -1,
        created_by_user_id: profileId,
        modified_by_user_id: profileId,
      },
      { onConflict: "user_id,caption_id" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}