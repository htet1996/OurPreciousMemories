import type { Memory } from "../types";
import MessagesFloat from "./MessagesFloat";

interface Props {
  messages: Memory[];
  // Kept for API compatibility with App; deletion now lives in the Timeline.
  onDeleted?: (id: string) => void;
}

export default function MessageBoard({ messages }: Props) {
  // Messages drift up into the air, one at a time.
  return <MessagesFloat messages={messages} />;
}
