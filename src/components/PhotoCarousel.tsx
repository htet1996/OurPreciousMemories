import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Memory } from "../types";
import { formatDate } from "../lib/format";

interface Props {
  photos: Memory[];
  interval?: number;
  /** called on tap (not swipe) — e.g. jump to the full Memories view */
  onOpen?: (index: number) => void;
}

/**
 * One photo at a time, auto-advancing. Swipe left/right (drag) to browse —
 * no arrows. Pauses while touched/hovered.
 */
export default function PhotoCarousel({ photos, interval = 3500, onOpen }: Props) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const movedRef = useRef(false);

  useEffect(() => {
    if (i > photos.length - 1) setI(0);
  }, [photos.length, i]);

  useEffect(() => {
    if (paused || photos.length <= 1) return;
    const id = window.setInterval(() => {
      setDir(1);
      setI((p) => (p + 1) % photos.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [paused, photos.length, interval]);

  if (photos.length === 0) return null;

  const idx = Math.min(i, photos.length - 1);
  const photo = photos[idx];
  const go = (n: number, d: number) => {
    setDir(d);
    setI((n + photos.length) % photos.length);
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl2 border border-white/60 bg-gradient-to-br from-pinkSoft/30 to-lavender/40 shadow-soft">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={photo.id}
            custom={dir}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragStart={() => {
              movedRef.current = false;
            }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -55) {
                movedRef.current = true;
                go(idx + 1, 1);
              } else if (info.offset.x > 55) {
                movedRef.current = true;
                go(idx - 1, -1);
              }
            }}
            onClick={() => {
              if (!movedRef.current) onOpen?.(idx);
            }}
            initial={{ opacity: 0, x: dir > 0 ? 90 : -90 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir > 0 ? -90 : 90 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          >
            <img
              src={photo.image_url ?? ""}
              alt={photo.caption ?? "Memory"}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-full w-full object-contain"
            />
            {(photo.caption || photo.author) && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-darkRose/75 to-transparent px-4 py-3">
                {photo.caption && (
                  <p className="line-clamp-2 font-body text-sm text-white">
                    {photo.caption}
                  </p>
                )}
                <p className="mt-0.5 font-body text-[11px] text-white/80">
                  {photo.author ? `${photo.author} · ` : ""}
                  {formatDate(photo.created_at)}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots (or a counter when there are many) */}
      {photos.length > 1 &&
        (photos.length <= 10 ? (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {photos.map((p, di) => (
              <button
                key={p.id}
                onClick={() => go(di, di > idx ? 1 : -1)}
                aria-label={`Photo ${di + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  di === idx ? "w-5 bg-pinkHot" : "w-2 bg-pinkSoft/70"
                }`}
              />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-center font-body text-xs text-roseGold">
            {idx + 1} / {photos.length} · swipe to browse
          </p>
        ))}
    </div>
  );
}
