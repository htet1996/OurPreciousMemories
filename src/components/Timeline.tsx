import { motion } from "framer-motion";
import { CalendarHeart, Image as ImageIcon, MessageCircle } from "lucide-react";
import type { Memory } from "../types";
import { formatDateTime } from "../lib/format";
import { EmptyState } from "./PhotoGallery";
import DeleteButton from "./DeleteButton";

interface Props {
  memories: Memory[];
  onDeleted: (id: string) => void;
}

/**
 * Chronological wall of everything (photos + messages), newest first,
 * along a soft vertical line.
 */
export default function Timeline({ memories, onDeleted }: Props) {
  if (memories.length === 0) {
    return (
      <EmptyState
        icon={<CalendarHeart size={40} />}
        title="Your timeline is empty"
        text="Every memory you add will appear here in order 🕰️"
      />
    );
  }

  return (
    <div className="relative mx-auto max-w-2xl">
      {/* vertical line */}
      <div className="absolute bottom-0 left-4 top-2 w-px bg-gradient-to-b from-pinkHot/60 via-plum/50 to-transparent sm:left-1/2" />

      <div className="space-y-8">
        {memories.map((m, i) => {
          const isPhoto = m.type === "photo";
          const alignRight = i % 2 === 1;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className={`relative pl-12 sm:w-1/2 sm:pl-0 ${
                alignRight
                  ? "sm:ml-auto sm:pl-10 sm:text-left"
                  : "sm:pr-10 sm:text-right"
              }`}
            >
              {/* dot */}
              <span
                className={`absolute left-[9px] top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pinkHot to-plum text-white shadow-glow sm:left-auto ${
                  alignRight ? "sm:-left-3" : "sm:-right-3"
                }`}
              >
                {isPhoto ? <ImageIcon size={12} /> : <MessageCircle size={12} />}
              </span>

              <div className="glass relative overflow-hidden p-4 text-left">
                <div className="absolute right-2.5 top-2.5 z-10">
                  <DeleteButton memory={m} onDeleted={onDeleted} tone="dark" />
                </div>

                {isPhoto && m.image_url && (
                  <img
                    src={m.image_url}
                    alt={m.caption ?? "Memory"}
                    loading="lazy"
                    decoding="async"
                    className="mb-3 max-h-56 w-full rounded-xl object-cover"
                  />
                )}
                {m.caption && (
                  <p className="whitespace-pre-wrap font-body text-sm text-darkRose">
                    {m.caption}
                  </p>
                )}
                <p className="mt-2 font-body text-xs text-roseGold">
                  {m.author ? `${m.author} · ` : ""}
                  {formatDateTime(m.created_at)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
