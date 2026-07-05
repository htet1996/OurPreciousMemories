import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./config";
import type { Memory, NewMemory } from "../types";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only build a real client when configured; otherwise leave it null so the UI
// can show a friendly "connect Supabase" message instead of throwing.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null;

export const PHOTOS_BUCKET = "photos";
const TABLE = "memories";

/** Fetch all memories, newest first. */
export async function fetchMemories(): Promise<Memory[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Memory[];
}

/** Insert a memory row and return the created record. */
export async function insertMemory(memory: NewMemory): Promise<Memory> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from(TABLE)
    .insert(memory)
    .select()
    .single();
  if (error) throw error;
  return data as Memory;
}

/**
 * Delete a memory row. If it's a photo, also remove the underlying file
 * from the "photos" storage bucket so nothing is left orphaned.
 */
export async function deleteMemory(memory: Memory): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase.from(TABLE).delete().eq("id", memory.id);
  if (error) throw error;

  // Best-effort storage cleanup for photos.
  if (memory.type === "photo" && memory.image_url) {
    const marker = `/${PHOTOS_BUCKET}/`;
    const idx = memory.image_url.indexOf(marker);
    if (idx !== -1) {
      const path = memory.image_url.slice(idx + marker.length);
      // Ignore errors here — the row is already gone, which is what matters.
      await supabase.storage.from(PHOTOS_BUCKET).remove([path]);
    }
  }
}

/**
 * Upload an image to the public "photos" bucket and return its public URL.
 * File name is de-duplicated with a timestamp + random suffix.
 */
export async function uploadPhoto(file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured.");

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeStamp = new Date().toISOString().replace(/[:.]/g, "-");
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `${safeStamp}-${rand}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
