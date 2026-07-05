export type MemoryType = "photo" | "message";

export interface Memory {
  id: string;
  type: MemoryType;
  image_url: string | null;
  caption: string | null;
  author: string | null;
  created_at: string;
}

// Shape used when inserting (id + created_at handled by the DB).
export interface NewMemory {
  type: MemoryType;
  image_url?: string | null;
  caption?: string | null;
  author?: string | null;
}
