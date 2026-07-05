import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Memory } from "../types";
import { formatDate } from "../lib/format";

interface Props {
  photos: Memory[];
  intervalMs?: number;
  onOpen?: (index: number) => void;
}

/**
 * Auto-advancing hero slideshow. Each slide cross-fades to the next and slowly
 * drifts/zooms (Ken Burns), so the wall feels alive. Pauses on hover/touch.
 */
export default function Slideshow({ photos, intervalMs = 4000, onOpen }: Props) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  // Keep index valid if the photo list shrinks.
  useEffect(() => {
    if (i >= photos.length) setI(0);
  }, [photos.length, i]);

  useEffect(() => {
    if (paused || photos.length <= 1) return;
    const id = window.setInterval(
      () => setI((n) => (n + 1) % photos.length),
      intervalMs
    );
    return () => window.clearInterval(id);
  }, [paused, photos.length, intervalMs]);

  if (photos.length === 0) return null;
  const current = photos[Math.min(i, photos.length - 1)];

  return (
    <div
      className="relative mb-8 aspect-[16/10] w-full overflow-hidden rounded-xl2 border border-white/60 shadow-soft sm:aspect-[16/9]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <AnimatePresence mode="popLayout">
        <motion.button
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          onClick={() => onOpen?.(Math.min(i, photos.length - 1))}
          className="absolute inset-0 h-full w-full cursor-pointer"
          aria-label={current.caption ?? "Open photo"}
        >
          <img
            src={current.image_url ?? ""}
            alt={current.caption ?? "Memory"}
            className={`h-full w-full object-cover ${
              i % 2 === 0 ? "animate-kenburns" : "animate-kenburnsAlt"
            }`}
          />
          {/* soft gradient so caption is readable */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-darkRose/70 to-transparent p-5 text-left">
            {current.caption && (
              <p className="font-body text-sm text-white drop-shadow sm:text-base">
                {current.caption}
              </p>
            )}
            <p className="mt-0.5 font-body text-xs text-white/80">
              {current.author ? `${current.author} · ` : ""}
              {formatDate(current.created_at)}
            </p>
          </div>
        </motion.button>
      </AnimatePresence>

      {/* dots */}
      {photos.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center gap-1.5">
          {photos.slice(0, 12).map((_, d) => (
            <span
              key={d}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                d === i % Math.min(photos.length, 12)
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
