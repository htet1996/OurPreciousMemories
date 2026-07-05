import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Memory } from "../types";
import { timeAgo, initial } from "../lib/format";
import DeleteButton from "./DeleteButton";

interface Props {
  message: Memory;
  onDeleted?: (id: string) => void;
  /** compact = smaller card used in the Home preview */
  compact?: boolean;
}

// Soft avatar gradients, chosen deterministically from the id.
const AVATARS = [
  "from-pinkHot to-plum",
  "from-plum to-lavender",
  "from-roseGold to-pinkSoft",
  "from-pinkSoft to-pinkHot",
];

function pickAvatar(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return AVATARS[sum % AVATARS.length];
}

export default function MessageCard({ message, onDeleted, compact }: Props) {
  // Heart "like" is a delightful, device-local toggle (persisted in localStorage).
  const storeKey = `liked:${message.id}`;
  const [liked, setLiked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storeKey) === "1";
    } catch {
      return false;
    }
  });

  const toggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(storeKey, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4 }}
      className="group relative flex gap-3 rounded-xl2 border border-white/60 bg-white/60 p-4 shadow-soft backdrop-blur-md"
    >
      {/* Avatar */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${pickAvatar(
          message.id
        )} font-display text-lg text-white shadow-soft`}
      >
        {initial(message.author)}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate font-body font-semibold text-darkRose">
            {message.author || "Someone who loves you"}
            <span className="ml-1">💗</span>
          </p>
          <span className="shrink-0 font-body text-xs text-roseGold">
            {timeAgo(message.created_at)}
          </span>
        </div>
        <p
          className={`mt-1 whitespace-pre-wrap font-body text-darkRose/90 ${
            compact ? "line-clamp-2 text-sm" : "text-[15px] leading-relaxed"
          }`}
        >
          {message.caption}
        </p>
      </div>

      {/* Heart like */}
      <button
        onClick={toggleLike}
        aria-label={liked ? "Unlike" : "Like"}
        className="self-center p-1"
      >
        <motion.span whileTap={{ scale: 1.4 }} className="block">
          <Heart
            size={20}
            className={
              liked ? "fill-pinkHot text-pinkHot" : "text-pinkSoft"
            }
          />
        </motion.span>
      </button>

      {/* Delete (hover / touch) */}
      {onDeleted && (
        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
          <DeleteButton memory={message} onDeleted={onDeleted} tone="dark" />
        </div>
      )}
    </motion.article>
  );
}
