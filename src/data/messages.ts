import { supa } from "./supabase";
import type { HeatMessage } from "@/core/types";

export async function listMessages(coupleId: string, limit = 100): Promise<HeatMessage[]> {
  const { data, error } = await supa
    .from("heat_messages")
    .select("*")
    .eq("couple_id", coupleId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data as HeatMessage[];
}

export async function sendText(coupleId: string, senderId: string, content: string) {
  const { data, error } = await supa
    .from("heat_messages")
    .insert({ couple_id: coupleId, sender_id: senderId, type: "text", content })
    .select()
    .single();
  if (error) throw error;
  return data as HeatMessage;
}

export async function sendProvocation(coupleId: string, senderId: string, text: string) {
  const { data, error } = await supa
    .from("heat_messages")
    .insert({ couple_id: coupleId, sender_id: senderId, type: "quick_provocation", content: text })
    .select()
    .single();
  if (error) throw error;
  return data as HeatMessage;
}


export async function sendPhoto(coupleId: string, senderId: string, mediaPath: string) {
  const { data, error } = await supa
    .from("heat_messages")
    .insert({ couple_id: coupleId, sender_id: senderId, type: "photo", media_url: mediaPath, is_one_view: true })
    .select()
    .single();
  if (error) throw error;
  return data as HeatMessage;
}
