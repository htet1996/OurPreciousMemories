import { useState } from "react";
import { motion } from "framer-motion";
import { config } from "../lib/config";
import Fireworks from "./Fireworks";
import GiftBox from "./GiftBox";

interface Props {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: Props) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    // Let the fireworks + gift pop play, then enter.
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

      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.2 }}
      >
        <p className="mb-3 font-body text-sm uppercase tracking-[0.35em] text-roseGold">
          For {config.name}
        </p>

        <h1 className="text-rosegold font-script text-5xl leading-tight sm:text-7xl">
          {config.greeting}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mx-auto mt-4 max-w-md font-body text-base text-darkRose/75 sm:text-lg"
        >
          {config.subtitle}
        </motion.p>
      </motion.div>

      <GiftBox opening={opening} onOpen={handleOpen} />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ delay: 1 }}
        className="mt-10 font-body text-sm text-darkRose/60"
      >
        Tap the gift to open it 🎁
      </motion.p>
    </motion.div>
  );
}
