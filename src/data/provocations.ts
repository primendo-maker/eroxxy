import { supa } from "./supabase";
import type { Provocation, Intensity } from "@/core/types";

export async function listProvocations(intensity?: Intensity): Promise<Provocation[]> {
  let q = supa.from("heat_provocations").select("*");
  if (intensity) q = q.eq("intensity", intensity);
  const { data, error } = await q.order("intensity");
  if (error) throw error;
  return data as Provocation[];
}
