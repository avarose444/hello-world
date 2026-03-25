"use client";

import { useState } from "react";
import Link from "next/link";

export default function GenerateClient() {
  const [status, setStatus] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generated, setGenerated] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function runPipeline(file: File) {
    try {
      setLoading(true);
      setStatus("Generating presigned URL...");
      setGenerated([]);

      // STEP 1: Generate presigned URL
      const s1 = await fetch("/api/pipeline/generate-presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type }),
      });

      if (!s1.ok) throw new Error("Step 1 failed");
      const { presignedUrl, cdnUrl } = await s1.json();
      localStorage.setItem("lastUploadedImageUrl", cdnUrl);

      // STEP 2: Upload image to S3
      setStatus("Uploading image...");
      const s2 = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!s2.ok) throw new Error("Step 2 failed");

      // STEP 3: Register image URL
      setStatus("Registering image...");
      const s3 = await fetch("/api/pipeline/upload-image-from-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: cdnUrl,
          isCommonUse: false,
        }),
      });

      if (!s3.ok) throw new Error("Step 3 failed");
      const { imageId } = await s3.json();

      // STEP 4: Generate captions
      setStatus("Generating captions...");
      const s4 = await fetch("/api/pipeline/generate-captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId }),
      });

      if (!s4.ok) throw new Error("Step 4 failed");

      const captions = await s4.json();
      setGenerated(Array.isArray(captions) ? captions : []);
      setStatus("Captions generated ✅");
    } catch (err: any) {
      console.error(err);
      setStatus(err.message || "Something failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <h1 style={{ fontSize: 48 }}>Generate Captions</h1>

      <p style={{ marginBottom: 20 }}>
        Upload an image to run the caption pipeline.
      </p>

      <label
        style={{
          display: "inline-block",
          padding: "12px 18px",
          border: "1px solid #ccc",
          borderRadius: 12,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        Upload image
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;

            const url = URL.createObjectURL(f);
            setPreviewUrl(url);
            runPipeline(f);
          }}
        />
      </label>

      {loading && <p>Working...</p>}

      {status && (
        <p style={{ marginTop: 10, fontWeight: 500 }}>
          {status}
        </p>
      )}

      {/* Image Preview */}
      {previewUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>Uploaded Image</h3>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: "100%",
              maxWidth: 500,
              borderRadius: 14,
              border: "1px solid #ddd",
            }}
          />
        </div>
      )}

      {/* Generated Captions */}
      {generated.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Generated Captions</h3>

          <div style={{ display: "grid", gap: 10 }}>
            {generated.map((c: any, i: number) => (
              <div
                key={c.id ?? i}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ fontSize: 16 }}>
                  {c.content ?? c.caption ?? c.text ?? JSON.stringify(c)}
                </div>

                {c.id && (
                  <div
                    style={{
                      opacity: 0.6,
                      marginTop: 6,
                      fontSize: 12,
                    }}
                  >
                    caption id: {c.id}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <Link href="/captions">
              Go rate them on /captions →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}