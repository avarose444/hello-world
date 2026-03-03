export const dynamic = "force-dynamic";

import "./globals.css";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <html lang="en">
      <body>
        <div className="container">
          <div className="shell">
            <div className="topbar">
              <div className="brand">
                <span className="badge" />
                <span>AlmostCrackd</span>
                <span className="kbd">hw5</span>
              </div>

              <div className="topbarRight">

                <div className="statusPill">
                  <span
                    className="dot"
                    style={{
                      background: user ? "#3dff9b" : "#ff5b5b",
                      boxShadow: user
                        ? "0 0 18px rgba(61, 255, 155, 0.35)"
                        : "0 0 18px rgba(255, 91, 91, 0.35)",
                    }}
                  />
                  <span>{user ? "Logged in" : "Logged out"}</span>
                </div>
              </div>
            </div>

            <div className="content">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}