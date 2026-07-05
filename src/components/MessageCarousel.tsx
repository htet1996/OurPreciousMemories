import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Memory } from "../types";
import MessageCard from "./MessageCard";

interface Props {
  messages: Memory[];
  onDeleted?: (id: string) => void;
  compact?: boolean;
  /** show prev/next arrows (full view) */
  controls?: boolean;
  /** ms between auto-advances */
  interval?: number;
}

/**
 * Shows ONE message at a time and auto-advances through them like a slideshow.
 * Pauses while the user hovers/touches. Dots + optional arrows to jump around.
 */
export default function MessageCarousel({
  messages,
  onDeleted,
  compact,
  controls,
  interval = 4500,
}: Props) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  // Keep the index valid if the list shrinks (e.g. after a delete).
  useEffect(() => {
    if (i > messages.length - 1) setI(0);
  }, [messages.length, i]);

  // Auto-advance.
  useEffect(() => {
    if (paused || messages.length <= 1) return;
    const id = window.setInterval(
      () => setI((p) => (p + 1) % messages.length),
      interval
    );
    return () => window.clearInterval(id);
  }, [paused, messages.length, interval]);

  if (messages.length === 0) return null;

  const idx = Math.min(i, messages.length - 1);
  const current = messages[idx];
  const go = (n: number) =>
    setI((n + messages.length) % messages.length);

  return (
    <div
      className="mx-auto max-w-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative">
        {/* Arrows */}
        {controls && messages.length > 1 && (
          <>
            <button
              onClick={() => go(idx - 1)}
              aria-label="Previous message"
              className="absolute -left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-darkRose shadow-soft transition hover:bg-white sm:-left-4"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => go(idx + 1)}
              aria-label="Next message"
              className="absolute -right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-darkRose shadow-soft transition hover:bg-white sm:-right-4"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* The animated single card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <MessageCard message={current} onDeleted={onDeleted} compact={compact} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      {messages.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {messages.map((m, di) => (
            <button
              key={m.id}
              onClick={() => setI(di)}
              aria-label={`Go to message ${di + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                di === idx ? "w-5 bg-pinkHot" : "w-2 bg-pinkSoft/70 hover:bg-pinkSoft"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
