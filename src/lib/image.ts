/**
 * Keep uploaded photos at good quality but capped at roughly 3MB, so the
 * gallery stays reasonably light no matter how big the original camera photo
 * is. Files already under the cap are uploaded untouched (full quality).
 * Animated GIFs are left as-is (canvas would flatten them to one frame).
 *
 * Returns a new File, or the original if compression isn't needed / fails.
 */
const TARGET_BYTES = 3 * 1024 * 1024; // ~3MB

export async function downscaleImage(
  file: File,
  maxDim = 2560
): Promise<File> {
  if (file.type === "image/gif" || !file.type.startsWith("image/")) {
    return file;
  }

  // Already small enough — keep the original at full quality.
  if (file.size <= TARGET_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const scale = Math.min(1, maxDim / Math.max(width, height));
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    // Step quality down until we're under ~3MB (or run out of steps).
    const type = "image/webp";
    let best: Blob | null = null;
    for (const q of [0.92, 0.86, 0.8, 0.72, 0.64]) {
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, type, q)
      );
      if (!blob) continue;
      best = blob;
      if (blob.size <= TARGET_BYTES) break;
    }

    if (!best || best.size >= file.size) return file;

    const base = file.name.replace(/\.[^.]+$/, "");
    return new File([best], `${base}.webp`, { type });
  } catch {
    // Any failure (e.g. unsupported format) — just upload the original.
    return file;
  }
}
