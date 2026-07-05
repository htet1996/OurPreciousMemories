import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "../lib/config";
import Fireworks from "./Fireworks";
import GiftBox from "./GiftBox";

interface Props {
  onEnter: () => void;
}

type Phase = "intro" | "gift";

export default function LandingPage({ onEnter }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [opening, setOpening] = useState(false);

  // The little message shows first, then the gift box appears on its own
  // (or as soon as the user taps to continue).
  useEffect(() => {
    if (phase !== "intro") return;
    const t = window.setTimeout(() => setPhase("gift"), 4200);
    return () => window.clearTimeout(t);
  }, [phase]);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onEnter, 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
    >
      {/* Fireworks burst the moment the gift is opened */}
      {opening && <Fireworks duration={1600} />}

      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <motion.button
            key="intro"
            type="button"
            onClick={() => setPhase("gift")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center outline-none"
          >
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.2 }}
              className="text-5xl"
            >
              💌
            </motion.span>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-3 mt-6 font-body text-xs uppercase tracking-[0.35em] text-roseGold"
            >
              For {config.name}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-rosegold max-w-md font-script text-4xl leading-snug sm:text-5xl"
            >
              {config.intro}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-8 font-body text-sm text-darkRose/55"
            >
              Tap to open your gift 🎁
            </motion.p>
          </motion.button>
        ) : (
          <motion.div
            key="gift"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.1 }}
            >
              <p className="mb-3 font-body text-sm uppercase tracking-[0.35em] text-roseGold">
                For {config.name}
              </p>
              <h1 className="text-rosegold font-script text-5xl leading-tight sm:text-7xl">
                {config.greeting}
              </h1>
              <p className="mx-auto mt-4 max-w-md font-body text-base text-darkRose/75 sm:text-lg">
                {config.subtitle}
              </p>
            </motion.div>

            <GiftBox opening={opening} onOpen={handleOpen} />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: opening ? 0 : 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 font-body text-sm text-darkRose/60"
            >
              Tap the gift to open it 🎁
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
