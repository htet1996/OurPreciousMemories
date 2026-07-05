import { motion } from "framer-motion";

interface Props {
  opening: boolean;
  onOpen: () => void;
}

/**
 * A glowing, tappable birthday gift. Idle: gentle float, pulsing halo,
 * orbiting sparkles. On tap: it swells and pops away (fireworks fill the
 * screen from the LandingPage).
 */
export default function GiftBox({ opening, onOpen }: Props) {
  return (
    <motion.button
      onClick={onOpen}
      aria-label="Open your gift"
      className="relative mt-12 outline-none"
      whileHover={opening ? undefined : { scale: 1.06 }}
      whileTap={opening ? undefined : { scale: 0.93 }}
      animate={opening ? { y: 0 } : { y: [0, -8, 0] }}
      transition={
        opening ? { duration: 0.4 } : { y: { repeat: Infinity, duration: 2.6, ease: "easeInOut" } }
      }
    >
      <div className="relative flex h-40 w-40 items-center justify-center">
        {/* Pulsing halo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-pinkHot/40 blur-2xl"
          animate={
            opening
              ? { scale: [1, 2.2], opacity: [0.6, 0] }
              : { scale: [1, 1.25, 1], opacity: [0.35, 0.6, 0.35] }
          }
          transition={
            opening ? { duration: 0.6 } : { repeat: Infinity, duration: 2.4, ease: "easeInOut" }
          }
        />

        {/* Soft outer ring */}
        <motion.div
          className="absolute inset-2 rounded-full border border-white/60"
          animate={opening ? { scale: 1.8, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* The gift disc */}
        <motion.div
          className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-pinkSoft via-pinkHot to-plum shadow-glow"
          animate={
            opening
              ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] }
              : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.6, ease: "easeIn" }}
        >
          <span className="text-6xl drop-shadow-md">🎁</span>
        </motion.div>

        {/* Orbiting sparkles (idle only) */}
        {!opening &&
          ["✨", "💗", "⭐", "🌸"].map((s, i) => (
            <motion.span
              key={i}
              className="absolute text-lg"
              style={{ left: "50%", top: "50%" }}
              animate={{
                x: [0, Math.cos((i / 4) * Math.PI * 2) * 78],
                y: [0, Math.sin((i / 4) * Math.PI * 2) * 78],
                opacity: [0, 1, 0.6, 1, 0],
                scale: [0.6, 1, 0.8, 1, 0.6],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.2,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            >
              {s}
            </motion.span>
          ))}
      </div>
    </motion.button>
  );
}
