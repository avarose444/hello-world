"use client";

import { useState } from "react";

type Caption = {
  id: string;
  content: string;
  like_count: number;
};

export default function CaptionCards({
  captions,
}: {
  captions: Caption[];
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function vote(captionId: string, direction: "up" | "down") {
    setMessage("");
    setLoadingId(captionId);

    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ captionId, direction }),
    });

    setLoadingId(null);

    if (!res.ok) {
      setMessage("Vote failed");
      return;
    }

    setMessage("Vote saved ✅");
  }

  return (
    <section style={{ marginTop: 24 }}>
      {message && <div className="success">{message}</div>}

      <div className="grid" style={{ gap: 16 }}>
        {captions.map((c) => (
          <div key={c.id} className="card cardHover">
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              {c.content}
            </div>

            <div className="captionFooter">
              <div>👍 {c.like_count ?? 0}</div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="voteBtn"
                  disabled={loadingId === c.id}
                  onClick={() => vote(c.id, "up")}
                >
                  👍
                </button>

                <button
                  className="voteBtn"
                  disabled={loadingId === c.id}
                  onClick={() => vote(c.id, "down")}
                >
                  👎
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}