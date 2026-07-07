import { useMemo } from "react";

/**
 * Subtle ambient background: hearts, petals & sparkles drifting upward.
 * Pure CSS animation (animate-floatUp) so it's cheap on mobile.
 */
const EMOJIS = ["🌸", "💗", "🌷", "✨", "🌺", "💕", "🦋", "🌼"];

interface FloatItem {
  left: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
  opacity: number;
}

export default function FloatingElements({ count = 6 }: { count?: number }) {
  const items = useMemo<FloatItem[]>(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        size: 14 + Math.random() * 22,
        duration: 12 + Math.random() * 16,
        delay: Math.random() * 16,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        opacity: 0.35 + Math.random() * 0.45,
      })),
    [count]
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute bottom-[-40px] animate-floatUp select-none"
          style={{
            left: `${it.left}%`,
            fontSize: `${it.size}px`,
            animationDuration: `${it.duration}s`,
            animationDelay: `${it.delay}s`,
            opacity: it.opacity,
          }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  );
}
