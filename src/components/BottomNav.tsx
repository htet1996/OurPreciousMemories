import { motion } from "framer-motion";
import { Home, Images, MessagesSquare, Clock } from "lucide-react";

export type TabKey = "home" | "gallery" | "messages" | "timeline";

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const ITEMS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "home", label: "Home", icon: <Home size={20} /> },
  { key: "gallery", label: "Memories", icon: <Images size={20} /> },
  { key: "messages", label: "Messages", icon: <MessagesSquare size={20} /> },
  { key: "timeline", label: "Timeline", icon: <Clock size={20} /> },
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4">
      <div
        className="flex w-full max-w-md items-stretch justify-between gap-1 rounded-full border border-white/60 bg-white/85 p-1.5 shadow-soft"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        {ITEMS.map((it) => {
          const on = active === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              aria-label={it.label}
              aria-current={on ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-2"
            >
              {on && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-pinkHot to-plum shadow-soft"
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors ${
                  on ? "text-white" : "text-roseGold"
                }`}
              >
                {it.icon}
              </span>
              <span
                className={`relative z-10 font-body text-[10px] font-medium transition-colors ${
                  on ? "text-white" : "text-darkRose/60"
                }`}
              >
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
