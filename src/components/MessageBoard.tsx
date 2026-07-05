import { MailOpen } from "lucide-react";
import type { Memory } from "../types";
import { EmptyState } from "./PhotoGallery";
import MessageCarousel from "./MessageCarousel";

interface Props {
  messages: Memory[];
  onDeleted: (id: string) => void;
}

export default function MessageBoard({ messages, onDeleted }: Props) {
  if (messages.length === 0) {
    return (
      <EmptyState
        icon={<MailOpen size={40} />}
        title="No messages yet"
        text="Write the first heartfelt note with the ➕ button 💌"
      />
    );
  }

  // Auto-playing, one-at-a-time — with arrows + dots to browse manually.
  return (
    <MessageCarousel messages={messages} onDeleted={onDeleted} controls />
  );
}
