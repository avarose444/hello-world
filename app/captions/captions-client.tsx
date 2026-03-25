"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Caption = {
  id: string;
  content: string;
  like_count?: number;
};

export default function CaptionsClient() {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("lastUploadedImageUrl");
    if (saved) setImageUrl(saved);

    async function loadCaptions() {
      try {
        const res = await fetch("/api/captions", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load captions");
        }

        setCaptions(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setStatus(e?.message || "Failed to load captions");
      } finally {
        setLoading(false);
      }
    }

    loadCaptions();
  }, []);

  async function vote(captionId: string, direction: "up" | "down") {
    setStatus("");

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ captionId, direction }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Vote failed");
      }

      setCaptions((prev) =>
        prev.map((c) =>
          c.id === captionId
            ? {
                ...c,
                like_count: (c.like_count ?? 0) + (direction === "up" ? 1 : -1),
              }
            : c
        )
      );

      setStatus("Vote saved ✅");
    } catch (e: any) {
      setStatus(e?.message || "Vote failed");
    }
  }

  return (
    <div>
      <div className="btnRow" style={{ marginBottom: 18 }}>
        <Link href="/protected" className="btn">
          ← Back to dashboard
        </Link>
        <Link href="/generate" className="btn">
          Generate more
        </Link>
      </div>

      <h1 className="heroTitle">Rate Captions</h1>
      <p className="sub">
        Only logged-in users can vote.
      </p>

      {imageUrl && (
        <div className="panel" style={{ marginBottom: 20 }}>
          <h3 className="cardTitle">Uploaded image</h3>
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="previewImg"
          />
        </div>
      )}

      {status && (
        <p className={status.includes("✅") ? "toastOk" : "toastErr"}>
          {status}
        </p>
      )}

      {loading ? (
        <p className="sub">Loading captions...</p>
      ) : (
        <div className="captionGrid" style={{ marginTop: 18 }}>
          {captions.map((c) => (
            <div key={c.id} className="captionCard">
              <div>
                <div className="captionText">{c.content}</div>
                <div className="mono" style={{ marginTop: 6 }}>
                  👍 {c.like_count ?? 0}
                </div>
              </div>

              <div className="voteBtns">
                <button className="iconBtn" onClick={() => vote(c.id, "up")}>
                  👍
                </button>
                <button className="iconBtn" onClick={() => vote(c.id, "down")}>
                  👎
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}