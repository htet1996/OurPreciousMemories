import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ImageOff, Maximize2 } from "lucide-react";
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

// Custom sizes the user can cycle a tile through. "auto" = size by orientation.
type SizeKey = "auto" | "small" | "wide" | "tall" | "big";
const SIZE_CYCLE: SizeKey[] = ["auto", "small", "wide", "tall", "big"];
const SIZE_LABEL: Record<SizeKey, string> = {
  auto: "Auto",
  small: "Small",
  wide: "Wide",
  tall: "Tall",
  big: "Big",
};

const STORE_KEY = "omg:photoSizes";

function loadSizes(): Record<string, SizeKey> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Grid span classes for a given custom size, or by orientation when "auto". */
function spanFor(size: SizeKey, o: Orientation): string {
  switch (size) {
    case "small":
      return "";
    case "wide":
      return "col-span-2";
    case "tall":
      return "row-span-2";
    case "big":
      return "col-span-2 row-span-2";
    default:
      // auto → follow the photo's real shape
      if (o === "portrait") return "row-span-2";
      if (o === "landscape") return "col-span-2";
      return "";
  }
}

export default function PhotoGallery({ photos, onDeleted }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const [orient, setOrient] = useState<Record<string, Orientation>>({});
  const [sizes, setSizes] = useState<Record<string, SizeKey>>(() => loadSizes());
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(sizes));
    } catch {
      /* ignore */
    }
  }, [sizes]);

  const measure = (id: string, img: HTMLImageElement) => {
    const { naturalWidth: w, naturalHeight: h } = img;
    if (!w || !h) return;
    const ratio = w / h;
    const o: Orientation =
      ratio > 1.2 ? "landscape" : ratio < 0.83 ? "portrait" : "square";
    setOrient((prev) => (prev[id] === o ? prev : { ...prev, [id]: o }));
  };

  const cycleSize = (id: string) => {
    setSizes((prev) => {
      const cur = prev[id] ?? "auto";
      const next = SIZE_CYCLE[(SIZE_CYCLE.indexOf(cur) + 1) % SIZE_CYCLE.length];
      return { ...prev, [id]: next };
    });
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

      {/* Arrange toggle */}
      <div className="mb-3 flex justify-end">
        <button
          onClick={() => setEditing((e) => !e)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-body text-sm font-medium transition ${
            editing
              ? "border-transparent bg-gradient-to-r from-pinkHot to-plum text-white shadow-soft"
              : "border-pinkSoft/70 bg-white/70 text-darkRose"
          }`}
        >
          <Maximize2 size={15} />
          {editing ? "Done arranging" : "Arrange sizes"}
        </button>
      </div>

      {/* Orientation-aware, customizable mosaic grid */}
      <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, i) => {
          const o = orient[photo.id] ?? "square";
          const size = sizes[photo.id] ?? "auto";
          return (
            <motion.figure
              key={photo.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 8) * 0.04 }}
              className={`gv-item group relative cursor-pointer overflow-hidden rounded-xl2 border border-white/60 bg-white/60 shadow-soft ${spanFor(
                size,
                o
              )}`}
              onClick={() => (editing ? cycleSize(photo.id) : setActive(i))}
            >
              {/* delete — appears on hover (always visible on touch) */}
              {!editing && (
                <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                  <DeleteButton memory={photo} onDeleted={onDeleted} tone="light" />
                </div>
              )}

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

              {/* Size badge while arranging */}
              {editing && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-darkRose/30">
                  <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 font-body text-xs font-semibold text-darkRose shadow-soft">
                    <Maximize2 size={13} /> {SIZE_LABEL[size]}
                  </span>
                </div>
              )}

              {/* caption overlay on hover (view mode only) */}
              {!editing && (photo.caption || photo.author) && (
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

      {editing && (
        <p className="mt-4 text-center font-body text-xs text-darkRose/60">
          Tap any photo to change its size · Small → Wide → Tall → Big → Auto
        </p>
      )}

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
