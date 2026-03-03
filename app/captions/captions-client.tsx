async function runPipeline(file: File) {
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
  const put = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });
  if (!put.ok) throw new Error(`Upload failed (${put.status})`);

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
  const captions = await s4.json();

  setCaptions(captions);
}