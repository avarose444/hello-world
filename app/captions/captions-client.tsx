"use client";

import { useState } from "react";
import Link from "next/link";

type Caption = {
  id: string;
  content: string;
  like_count?: number;
};

export default function CaptionsClient() {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [status, setStatus] = useState<string>("");

  async function refreshCaptions() {
    setStatus("");
    try {
      const res = await fetch("/api/pipeline/generate-captions", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      const data = await res.json();

      // Accept either { captions: [...] } OR just [...]
      const next = Array.isArray(data) ? data : data?.captions;
      setCaptions(next ?? []);
      setStatus("Loaded ✅");
    } catch (e: any) {
      setStatus(e?.message ?? "Something went wrong");
    }
  }

  return (
    <div>
      <h1>Rate Captions</h1>
      <p>Only logged-in users can vote.</p>

      <div style={{ display: "flex", gap: 12, margin: "14px 0" }}>
        <button className="btn" onClick={refreshCaptions}>
          Refresh captions
        </button>
        <Link className="btn" href="/generate">
          Go to generate
        </Link>
      </div>

      {status ? <p>{status}</p> : null}

      <div style={{ marginTop: 12 }}>
        {captions.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 14,
              padding: 14,
              marginBottom: 12,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 650 }}>{c.content}</div>
              <div style={{ opacity: 0.7, fontSize: 12 }}>caption id: {c.id}</div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" onClick={() => vote(c.id, "up")}>
                👍
              </button>
              <button className="btn" onClick={() => vote(c.id, "down")}>
                👎
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  async function vote(captionId: string, direction: "up" | "down") {
    setStatus("");
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captionId, direction }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Vote failed (${res.status})`);
      }

      setStatus("Vote saved ✅");
    } catch (e: any) {
      setStatus(e?.message ?? "Vote failed");
    }
  }
}