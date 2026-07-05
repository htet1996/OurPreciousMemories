import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MailOpen } from "lucide-react";
import type { Memory } from "../types";
import { initial } from "../lib/format";
import { EmptyState } from "./PhotoGallery";

interface Props {
  messages: Memory[];
}

interface Floater {
  key: number;
  msg: Memory;
  drift: number; // horizontal sway in px
  dur: number; // seconds to rise
  side: number; // -1..1 starting horizontal bias
}

const AVATARS = [
  "from-pinkHot to-plum",
  "from-plum to-lavender",
  "from-roseGold to-pinkSoft",
  "from-pinkSoft to-pinkHot",
];
function avatar(id: string) {
  let s = 0;
  for (let i = 0; i < id.length; i++) s += id.charCodeAt(i);
  return AVATARS[s % AVATARS.length];
}

/**
 * Messages drift up into the air one at a time — each rises slowly from the
 * bottom, swaying gently, fading in then out near the top. Loops through all
 * messages forever. Purely ambient (tap the ➕ to add; delete via Timeline).
 */
export default function MessagesFloat({ messages }: Props) {
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const seqRef = useRef(0);
  const msgIdxRef = useRef(0);

  useEffect(() => {
    if (messages.length === 0) return;

    const spawn = () => {
      const msg = messages[msgIdxRef.current % messages.length];
      msgIdxRef.current += 1;
      const key = seqRef.current++;
      setFloaters((prev) => [
        ...prev,
        {
          key,
          msg,
          drift: 14 + Math.random() * 22,
          dur: 12 + Math.random() * 4,
          side: (Math.random() - 0.5) * 1.4,
        },
      ]);
    };

    spawn();
    const id = window.setInterval(spawn, 4600);
    return () => window.clearInterval(id);
  }, [messages]);

  const remove = (key: number) =>
    setFloaters((prev) => prev.filter((f) => f.key !== key));

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={<MailOpen size={40} />}
        title="No messages yet"
        text="Write the first heartfelt note with the ➕ button 💌"
      />
    );
  }

  return (
    <div className="relative min-h-[72vh] overflow-hidden">
      {floaters.map((f) => {
        const swayLeft = f.side < 0;
        return (
          <div
            key={f.key}
            className="absolute bottom-0 w-[min(86vw,20rem)]"
            style={{ left: `calc(50% + ${f.side * 18}%)`, marginLeft: "-10rem" }}
          >
            <motion.div
              initial={{ y: "14vh", opacity: 0 }}
              animate={{
                y: "-96vh",
                opacity: [0, 1, 1, 0],
                x: swayLeft
                  ? [0, -f.drift, f.drift * 0.6, 0]
                  : [0, f.drift, -f.drift * 0.6, 0],
              }}
              transition={{
                duration: f.dur,
                ease: "linear",
                opacity: { duration: f.dur, times: [0, 0.12, 0.82, 1] },
                x: { duration: f.dur, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
              }}
              onAnimationComplete={() => remove(f.key)}
              className="rounded-xl2 border border-white/60 bg-white/80 px-5 py-4 shadow-soft"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatar(
                    f.msg.id
                  )} font-display text-sm text-white`}
                >
                  {initial(f.msg.author)}
                </span>
                <span className="truncate font-body text-sm font-semibold text-darkRose">
                  {f.msg.author || "Someone who loves you"} 💗
                </span>
              </div>
              <p className="whitespace-pre-wrap font-body text-sm leading-relaxed text-darkRose/90">
                {f.msg.caption}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
