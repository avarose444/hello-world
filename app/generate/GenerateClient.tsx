"use client";

import { useState } from "react";

export default function GenerateClient() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function runPipeline(file: File) {
    setLoading(true);
    setMsg("");
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const contentType = file.type || "image/jpeg";

      // Step 1
      const s1 = await fetch("/api/pipeline/generate-presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType }),
      });
      if (!s1.ok) throw new Error(`Step 1 failed (${s1.status})`);
      const { presignedUrl, cdnUrl } = await s1.json();

      // Step 2
      const putRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
      });
      if (!putRes.ok) throw new Error(`Upload failed (${putRes.status})`);

      // Step 3
      const s3 = await fetch("/api/pipeline/upload-image-from-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
      });
      if (!s3.ok) throw new Error(`Step 3 failed (${s3.status})`);
      const { imageId } = await s3.json();

      // Step 4
      const s4 = await fetch("/api/pipeline/generate-captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId }),
      });
      if (!s4.ok) throw new Error(`Step 4 failed (${s4.status})`);

      setMsg("Captions generated ✅ Now go to Rate!");
    } catch (e: any) {
      setMsg(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="hero">
        <h1 className="h1">Generate captions</h1>
        <p className="sub">Upload an image to run the pipeline.</p>

        <div className="row">
          <label className="btn btnPrimary">
            {loading ? "Working…" : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
              style={{ display: "none" }}
              disabled={loading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) runPipeline(f);
              }}
            />
          </label>
        </div>

        {previewUrl && (
          <img
            src={previewUrl}
            alt="preview"
            style={{
              marginTop: 14,
              maxWidth: 420,
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          />
        )}

        {msg && <p className="sub" style={{ marginTop: 12 }}>{msg}</p>}
      </div>
    </div>
  );
}