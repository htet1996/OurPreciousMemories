import { useState, type FormEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { insertMemory } from "../lib/supabase";
import type { Memory } from "../types";

interface Props {
  onDone: (created: Memory) => void;
}

export default function AddMessage({ onDone }: Props) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please write a little something 💗");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const created = await insertMemory({
        type: "message",
        caption: text.trim(),
        author: author.trim() || null,
        image_url: null,
      });
      onDone(created);
    } catch (err) {
      console.error(err);
      setError("Couldn't save. Check your Supabase connection & table.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        autoFocus
        placeholder="Write your heartfelt message…"
        className="w-full resize-none rounded-2xl border border-pinkSoft/70 bg-white/80 px-4 py-3 font-body leading-relaxed text-darkRose outline-none transition focus:border-pinkHot"
      />
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-2xl border border-pinkSoft/70 bg-white/80 px-4 py-3 font-body text-darkRose outline-none transition focus:border-pinkHot"
      />

      {error && <p className="font-body text-sm text-pinkHot">{error}</p>}

      <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
        {busy ? (
          <>
            <Loader2 className="animate-spin" size={18} /> Saving…
          </>
        ) : (
          <>
            <Send size={18} /> Save Message
          </>
        )}
      </button>
    </form>
  );
}
