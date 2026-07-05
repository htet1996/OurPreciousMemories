import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Heart } from "lucide-react";
import { MusicButton } from "./MusicProvider";

interface Props {
  onOpenMenu: () => void;
}

interface Burst {
  id: number;
  x: number;
}

/**
 * Sticky floating top bar: ☰ menu (left) · music + ♡ (right).
 * The heart sprinkles floating hearts on tap — pure delight.
 */
export default function TopBar({ onOpenMenu }: Props) {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [seq, setSeq] = useState(0);

  const sprinkle = () => {
    const base = seq;
    setSeq((s) => s + 6);
    const next: Burst[] = Array.from({ length: 6 }).map((_, i) => ({
      id: base + i,
      x: (i - 2.5) * 16,
    }));
    setBursts((prev) => [...prev, ...next]);
    window.setTimeout(() => {
      const ids = new Set(next.map((b) => b.id));
      setBursts((prev) => prev.filter((b) => !ids.has(b.id)));
    }, 1400);
  };

  const glassBtn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/80 text-roseGold shadow-soft transition-all hover:scale-105 active:scale-95";

  return (
    <div className="sticky top-0 z-40">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <button onClick={onOpenMenu} aria-label="Open menu" className={glassBtn}>
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <MusicButton />

          <div className="relative">
            <button onClick={sprinkle} aria-label="Send love" className={glassBtn}>
              <Heart size={20} className="fill-pinkHot/80 text-pinkHot" />
            </button>

            {/* floating hearts */}
            <AnimatePresence>
              {bursts.map((b) => (
                <motion.span
                  key={b.id}
                  initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], y: -70, x: b.x, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.3, ease: "easeOut" }}
                  className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 text-pinkHot"
                >
                  💗
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
