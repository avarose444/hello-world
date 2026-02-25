"use client";

import { useState } from "react";

type CaptionRow = Record<string, any>;

export default function CaptionCards({ captions }: { captions: CaptionRow[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  // pick the most likely caption text field
  const getText = (c: CaptionRow) =>
    c.caption ?? c.text ?? c.content ?? c.title ?? JSON.stringify(c);

  async function submitVote(captionId: string, direction: "up" | "down") {
    setMessage("");
    setLoadingId(captionId);

    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ captionId, direction }),
    });

    const json = await res.json().catch(() => ({}));
    setLoadingId(null);

    if (!res.ok) {
      setMessage(json?.error ?? "Vote failed");
      return;
    }

    setMessage("Vote saved ✅");
  }

  return (
    <section style={{ marginTop: 16 }}>
      {message ? <p>{message}</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {captions.map((c) => {
          const id = String(c.id);
          return (
            <div
              key={id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{getText(c)}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>caption id: {id}</div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => submitVote(id, "up")}
                  disabled={loadingId === id}
                >
                  👍
                </button>
                <button
                  onClick={() => submitVote(id, "down")}
                  disabled={loadingId === id}
                >
                  👎
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}