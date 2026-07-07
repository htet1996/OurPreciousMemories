import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Images, MessagesSquare, Clock, Plus, Heart } from "lucide-react";
import { config } from "../lib/config";
import type { TabKey } from "./BottomNav";
import { MusicPanel } from "./MusicProvider";

interface Props {
  open: boolean;
  onClose: () => void;
  active: TabKey;
  onNavigate: (tab: TabKey) => void;
  onAdd: () => void;
}

const LINKS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "home", label: "Home", icon: <Home size={18} /> },
  { key: "gallery", label: "Memories", icon: <Images size={18} /> },
  { key: "messages", label: "Messages", icon: <MessagesSquare size={18} /> },
  { key: "timeline", label: "Timeline", icon: <Clock size={18} /> },
];

export default function MenuDrawer({
  open,
  onClose,
  active,
  onNavigate,
  onAdd,
}: Props) {
  const go = (tab: TabKey) => {
    onNavigate(tab);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] bg-darkRose/50"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="glass flex h-full w-[82%] max-w-xs flex-col rounded-l-none rounded-r-xl2 p-6 will-change-transform"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="font-body text-[11px] uppercase tracking-[0.3em] text-roseGold">
                  For {config.name}
                </p>
                <h2 className="text-rosegold font-script text-3xl leading-tight">
                  {config.greeting}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-darkRose transition hover:bg-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mb-6 font-body text-sm text-darkRose/70">
              {config.subtitle}
            </p>

            <nav className="flex flex-col gap-1.5">
              {LINKS.map((l) => (
                <button
                  key={l.key}
                  onClick={() => go(l.key)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left font-body font-medium transition ${
                    active === l.key
                      ? "bg-gradient-to-r from-pinkHot to-plum text-white shadow-soft"
                      : "text-darkRose/80 hover:bg-white/70"
                  }`}
                >
                  {l.icon}
                  {l.label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => {
                onAdd();
                onClose();
              }}
              className="btn-primary mt-6"
            >
              <Plus size={18} /> Add a Memory
            </button>

            {/* Playlist controls */}
            <MusicPanel />

            <div className="mt-auto pt-6 text-center">
              <p className="flex items-center justify-center gap-1 font-body text-xs text-darkRose/50">
                Made with <Heart size={12} className="fill-pinkHot text-pinkHot" />
              </p>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
