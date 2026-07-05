import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, PenLine } from "lucide-react";
import PhotoUpload from "./PhotoUpload";
import AddMessage from "./AddMessage";
import type { Memory } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (m: Memory) => void;
}

type Tab = "photo" | "message";

export default function AddMemoryModal({ open, onClose, onCreated }: Props) {
  const [tab, setTab] = useState<Tab>("photo");

  const handleCreated = (m: Memory) => {
    onCreated(m);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-darkRose/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 130, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="glass max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-b-none rounded-t-xl2 p-6 sm:rounded-xl2"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="heading-display text-xl">Add a Memory</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-darkRose transition hover:bg-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-white/50 p-1">
              <TabButton
                active={tab === "photo"}
                onClick={() => setTab("photo")}
                icon={<ImageIcon size={16} />}
                label="Photo"
              />
              <TabButton
                active={tab === "message"}
                onClick={() => setTab("message")}
                icon={<PenLine size={16} />}
                label="Message"
              />
            </div>

            {tab === "photo" ? (
              <PhotoUpload onDone={handleCreated} />
            ) : (
              <AddMessage onDone={handleCreated} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 font-body text-sm font-medium transition ${
        active
          ? "bg-gradient-to-r from-pinkHot to-plum text-white shadow-soft"
          : "text-darkRose/70 hover:text-darkRose"
      }`}
    >
      {icon} {label}
    </button>
  );
}
