import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check, X, Loader2 } from "lucide-react";
import { deleteMemory } from "../lib/supabase";
import type { Memory } from "../types";

interface Props {
  memory: Memory;
  onDeleted: (id: string) => void;
  /** "light" for use over photos (white icon), "dark" for cards. */
  tone?: "light" | "dark";
}

/**
 * Trash button with a two-step confirm (tap once → "Sure?" ✓/✗) so a memory
 * is never deleted by an accidental tap.
 */
export default function DeleteButton({ memory, onDeleted, tone = "dark" }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const remove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setBusy(true);
    try {
      await deleteMemory(memory);
      onDeleted(memory.id);
    } catch (err) {
      console.error(err);
      alert("Couldn't delete. Make sure the delete policy is set in Supabase.");
      setBusy(false);
      setConfirming(false);
    }
  };

  const baseIcon =
    tone === "light"
      ? "bg-black/35 text-white hover:bg-black/55"
      : "bg-white/70 text-darkRose hover:bg-white";

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <AnimatePresence mode="wait" initial={false}>
        {!confirming ? (
          <motion.button
            key="trash"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              setConfirming(true);
            }}
            aria-label="Delete"
            className={`flex h-8 w-8 items-center justify-center rounded-full shadow-soft backdrop-blur-sm transition ${baseIcon}`}
          >
            <Trash2 size={15} />
          </motion.button>
        ) : (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1 rounded-full bg-white/90 p-1 shadow-soft backdrop-blur-sm"
          >
            <button
              onClick={remove}
              disabled={busy}
              aria-label="Confirm delete"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-pinkHot text-white transition hover:brightness-105 disabled:opacity-60"
            >
              {busy ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirming(false);
              }}
              disabled={busy}
              aria-label="Cancel"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-darkRose/10 text-darkRose transition hover:bg-darkRose/20"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
