import { useRef, useState, type FormEvent } from "react";
import { UploadCloud, Loader2, ImagePlus } from "lucide-react";
import { insertMemory, uploadPhoto } from "../lib/supabase";
import { downscaleImage } from "../lib/image";
import type { Memory } from "../types";

interface Props {
  onDone: (created: Memory) => void;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export default function PhotoUpload({ onDone }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [author, setAuthor] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickFile = (f: File | null) => {
    setError(null);
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setError("That image is over 5MB — please choose a smaller one.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please choose a photo first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      // Shrink big photos before upload so the gallery stays fast at scale.
      const optimized = await downscaleImage(file);
      const url = await uploadPhoto(optimized);
      const created = await insertMemory({
        type: "photo",
        image_url: url,
        caption: caption.trim() || null,
        author: author.trim() || null,
      });
      onDone(created);
    } catch (err) {
      console.error(err);
      setError(
        "Upload failed. Check your Supabase 'photos' bucket exists and is public."
      );
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Drop / pick zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl2 border-2 border-dashed border-pinkSoft bg-white/60 px-4 py-8 text-center transition hover:border-pinkHot hover:bg-white/80"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="max-h-56 rounded-xl object-contain"
          />
        ) : (
          <>
            <ImagePlus className="text-roseGold" size={34} />
            <span className="font-body text-sm text-darkRose/70">
              Tap to choose a photo
            </span>
            <span className="font-body text-xs text-darkRose/50">
              JPG · PNG · WEBP · GIF · up to 5MB
            </span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />

      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption or a little note (optional)"
        className="field"
      />
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Your name (optional)"
        className="field"
      />

      {error && <p className="font-body text-sm text-pinkHot">{error}</p>}

      <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
        {busy ? (
          <>
            <Loader2 className="animate-spin" size={18} /> Uploading…
          </>
        ) : (
          <>
            <UploadCloud size={18} /> Add Photo
          </>
        )}
      </button>
    </form>
  );
}
