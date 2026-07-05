import { useState } from "react";
import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";
import type { Memory } from "../types";
import { formatDate } from "../lib/format";
import Lightbox from "./Lightbox";
import Slideshow from "./Slideshow";
import DeleteButton from "./DeleteButton";

interface Props {
  photos: Memory[];
  onDeleted: (id: string) => void;
}

type Orientation = "portrait" | "landscape" | "square";

/**
 * Grid classes per orientation, so the wall becomes a lively mosaic where
 * every photo is sized by its own shape (portrait = tall, landscape = wide).
 */
function spanFor(o: Orientation): string {
  switch (o) {
    case "portrait":
      return "row-span-2"; // tall
    case "landscape":
      return "sm:col-span-2"; // wide
    default:
      return ""; // square = 1x1
  }
}

export default function PhotoGallery({ photos, onDeleted }: Props) {
  const [active, setActive] = useState<number | null>(null);
  // Measured orientation per photo id (filled once each image loads).
  const [orient, setOrient] = useState<Record<string, Orientation>>({});

  const measure = (id: string, img: HTMLImageElement) => {
    const { naturalWidth: w, naturalHeight: h } = img;
    if (!w || !h) return;
    const ratio = w / h;
    const o: Orientation =
      ratio > 1.2 ? "landscape" : ratio < 0.83 ? "portrait" : "square";
    setOrient((prev) => (prev[id] === o ? prev : { ...prev, [id]: o }));
  };

  if (photos.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff size={40} />}
        title="No photos yet"
        text="Tap the ➕ button to add your very first memory 🌸"
      />
    );
  }

  return (
    <>
      {/* Live auto-advancing hero */}
      <Slideshow photos={photos} onOpen={(idx) => setActive(idx)} />

      {/* Orientation-aware mosaic grid */}
      <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, i) => {
          const o = orient[photo.id] ?? "square";
          return (
            <motion.figure
              key={photo.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 8) * 0.04 }}
              className={`gv-item group relative cursor-pointer overflow-hidden rounded-xl2 border border-white/60 bg-white/60 shadow-soft ${spanFor(
                o
              )}`}
              onClick={() => setActive(i)}
            >
              {/* delete — appears on hover (always visible on touch) */}
              <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                <DeleteButton memory={photo} onDeleted={onDeleted} tone="light" />
              </div>

              <img
                src={photo.image_url ?? ""}
                alt={photo.caption ?? "Memory"}
                loading="lazy"
                decoding="async"
                onLoad={(e) => measure(photo.id, e.currentTarget)}
                className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-110 ${
                  i % 2 === 0 ? "animate-kenburns" : "animate-kenburnsAlt"
                }`}
              />

              {/* caption overlay on hover */}
              {(photo.caption || photo.author) && (
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-darkRose/75 to-transparent px-3 py-2.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {photo.caption && (
                    <p className="line-clamp-2 font-body text-xs text-white">
                      {photo.caption}
                    </p>
                  )}
                  <p className="mt-0.5 font-body text-[10px] text-white/80">
                    {photo.author ? `${photo.author} · ` : ""}
                    {formatDate(photo.created_at)}
                  </p>
                </figcaption>
              )}
            </motion.figure>
          );
        })}
      </div>

      <Lightbox
        photos={photos}
        index={active}
        onClose={() => setActive(null)}
        onNavigate={setActive}
      />
    </>
  );
}

export function EmptyState({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass mx-auto mt-6 flex max-w-md flex-col items-center gap-3 px-8 py-12 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pinkSoft/30 text-roseGold">
        {icon}
      </div>
      <h3 className="heading-display text-xl">{title}</h3>
      <p className="font-body text-sm text-darkRose/70">{text}</p>
    </motion.div>
  );
}
