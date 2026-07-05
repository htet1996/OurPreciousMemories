import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Memory } from "../types";
import MessageCard from "./MessageCard";

interface Props {
  messages: Memory[];
  onDeleted?: (id: string) => void;
  compact?: boolean;
  /** ms between auto-advances */
  interval?: number;
}

/**
 * Shows ONE message at a time and auto-advances. Swipe left/right (drag) to
 * browse — no arrows. Pauses while hovered/touched. Dots to jump around.
 */
export default function MessageCarousel({
  messages,
  onDeleted,
  compact,
  interval = 4500,
}: Props) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (i > messages.length - 1) setI(0);
  }, [messages.length, i]);

  useEffect(() => {
    if (paused || messages.length <= 1) return;
    const id = window.setInterval(() => {
      setDir(1);
      setI((p) => (p + 1) % messages.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [paused, messages.length, interval]);

  if (messages.length === 0) return null;

  const idx = Math.min(i, messages.length - 1);
  const current = messages[idx];
  const go = (n: number, d: number) => {
    setDir(d);
    setI((n + messages.length) % messages.length);
  };

  return (
    <div
      className="mx-auto max-w-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={current.id}
          custom={dir}
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            if (info.offset.x < -55) go(idx + 1, 1);
            else if (info.offset.x > 55) go(idx - 1, -1);
          }}
          initial={{ opacity: 0, x: dir > 0 ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir > 0 ? -60 : 60 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="cursor-grab touch-pan-y active:cursor-grabbing"
        >
          <MessageCard message={current} onDeleted={onDeleted} compact={compact} />
        </motion.div>
      </AnimatePresence>

      {messages.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {messages.map((m, di) => (
            <button
              key={m.id}
              onClick={() => go(di, di > idx ? 1 : -1)}
              aria-label={`Message ${di + 1}`}
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
