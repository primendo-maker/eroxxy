import { supa } from "./supabase";
import type { Intensity } from "@/core/types";

export async function updateProfile(input: {
  nickname?: string;
  persona_name?: string;
  bio?: string;
  intensity_pref?: Intensity;
}) {
  const { data: { session } } = await supa.auth.getSession();
  if (!session) throw new Error("Sem sessão");
  const { data, error } = await supa
    .from("heat_profiles")
    .update(input)
    .eq("id", session.user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setPersonaMode(active: boolean) {
  const { data: { session } } = await supa.auth.getSession();
  if (!session) throw new Error("Sem sessão");
  const { error } = await supa
    .from("heat_profiles")
    .update({ in_persona_mode: active })
    .eq("id", session.user.id);
  if (error) throw error;
}
