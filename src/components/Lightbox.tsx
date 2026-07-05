import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Memory } from "../types";
import { formatDate } from "../lib/format";

interface Props {
  photos: Memory[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ photos, index, onClose, onNavigate }: Props) {
  const open = index !== null;

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % photos.length);
  }, [index, photos.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, goPrev, goNext]);

  const photo = open ? photos[index] : null;

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-darkRose/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/35"
          >
            <X size={22} />
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous"
                className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/35 sm:left-6"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next"
                className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/35 sm:right-6"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <motion.div
            key={photo.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="max-h-[88dvh] w-full max-w-3xl overflow-hidden rounded-xl2 bg-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photo.image_url ?? ""}
              alt={photo.caption ?? "Memory"}
              className="max-h-[70dvh] w-full object-contain"
            />
            {(photo.caption || photo.author) && (
              <div className="bg-white/90 px-5 py-4 text-center">
                {photo.caption && (
                  <p className="font-body text-darkRose">{photo.caption}</p>
                )}
                <p className="mt-1 font-body text-xs text-roseGold">
                  {photo.author ? `${photo.author} · ` : ""}
                  {formatDate(photo.created_at)}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
