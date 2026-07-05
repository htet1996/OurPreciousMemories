import { Images, MessagesSquare, ChevronRight, ImageOff, MailOpen } from "lucide-react";
import type { Memory } from "../types";
import { config } from "../lib/config";
import MessageCarousel from "./MessageCarousel";
import PhotoCarousel from "./PhotoCarousel";

interface Props {
  photos: Memory[];
  messages: Memory[];
  onViewMemories: () => void;
  onViewMessages: () => void;
}

export default function HomeDashboard({
  photos,
  messages,
  onViewMemories,
  onViewMessages,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <header className="pt-2 text-center">
        <p className="font-body text-[11px] uppercase tracking-[0.35em] text-roseGold">
          For {config.name}
        </p>
        <h1 className="text-rosegold font-script text-5xl leading-[1.05] sm:text-6xl">
          {config.greeting}
        </h1>
        <p className="mx-auto mt-3 max-w-md font-body text-sm text-darkRose/70">
          {config.subtitle}
        </p>

        {(photos.length > 0 || messages.length > 0) && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="rounded-full border border-white/70 bg-white/60 px-3 py-1 font-body text-xs text-darkRose/75">
              🌸 {photos.length} {photos.length === 1 ? "memory" : "memories"}
            </span>
            <span className="rounded-full border border-white/70 bg-white/60 px-3 py-1 font-body text-xs text-darkRose/75">
              💌 {messages.length} {messages.length === 1 ? "message" : "messages"}
            </span>
          </div>
        )}
      </header>

      {/* Memories preview */}
      <section className="card-section">
        <SectionHeader
          icon={<Images size={18} />}
          title="Memories"
          onViewAll={onViewMemories}
        />
        {photos.length === 0 ? (
          <MiniEmpty icon={<ImageOff size={26} />} text="No photos yet — add your first 🌸" />
        ) : (
          // One photo at a time, auto-plays; swipe to browse, tap to open all.
          <PhotoCarousel photos={photos} onOpen={onViewMemories} />
        )}
      </section>

      {/* Messages preview */}
      <section className="card-section">
        <SectionHeader
          icon={<MessagesSquare size={18} />}
          title="Messages"
          onViewAll={onViewMessages}
        />
        {messages.length === 0 ? (
          <MiniEmpty icon={<MailOpen size={26} />} text="No messages yet — write the first 💌" />
        ) : (
          // Auto-plays through every message, one at a time.
          <MessageCarousel messages={messages} compact />
        )}
      </section>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  onViewAll,
}: {
  icon: React.ReactNode;
  title: string;
  onViewAll: () => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-darkRose">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pinkSoft/40 text-roseGold">
          {icon}
        </span>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
      </div>
      <button
        onClick={onViewAll}
        className="flex items-center gap-0.5 font-body text-sm font-medium text-roseGold transition hover:text-pinkHot"
      >
        View all <ChevronRight size={16} />
      </button>
    </div>
  );
}

function MiniEmpty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center text-darkRose/60">
      <span className="text-roseGold">{icon}</span>
      <p className="font-body text-sm">{text}</p>
    </div>
  );
}
