import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login");

  return (
    <div className="dash">
      <div className="heroCard">
        <div className="heroTop">
          <div>
            <div className="eyebrow">AlmostCrackd • hw5</div>
            <h1 className="heroTitle">Dashboard</h1>
            <p className="heroSub">
              You’re signed in as <span className="mono">{user.email}</span>. Choose what you want to do next.
            </p>
          </div>

          <div className="heroPill">
            <span className="dotLive" />
            Authenticated
          </div>
        </div>

        <div className="actionGrid">
          <Link className="actionCard" href="/generate">
            <div className="actionIcon">✨</div>
            <div>
              <div className="actionTitle">Generate captions</div>
              <div className="actionSub">Upload an image → run pipeline</div>
            </div>
            <div className="actionArrow">→</div>
          </Link>

          <Link className="actionCard" href="/captions">
            <div className="actionIcon">👍</div>
            <div>
              <div className="actionTitle">Rate captions</div>
              <div className="actionSub">Vote (up/down) to mutate data</div>
            </div>
            <div className="actionArrow">→</div>
          </Link>

          <Link className="actionCard" href="/list">
            <div className="actionIcon">🗂️</div>
            <div>
              <div className="actionTitle">Supabase list</div>
              <div className="actionSub">Browse your stored rows</div>
            </div>
            <div className="actionArrow">→</div>
          </Link>

          <Link className="actionCard danger" href="/logout">
            <div className="actionIcon">🚪</div>
            <div>
              <div className="actionTitle">Sign out</div>
              <div className="actionSub">End session</div>
            </div>
            <div className="actionArrow">→</div>
          </Link>
        </div>

        <div className="heroFooter">
          <div className="hint">
            Flow: <b>Generate</b> → <b>Rate</b>
          </div>
        </div>
      </div>
    </div>
  );
}