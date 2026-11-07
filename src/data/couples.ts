import { supa } from "./supabase";

// Gera código de 6 dígitos
function generatePairCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createCouple(userId: string) {
  // Tenta até 5x pra evitar colisão de pair_code
  for (let i = 0; i < 5; i++) {
    const code = generatePairCode();
    const { data, error } = await supa
      .from("heat_couples")
      .insert({ pair_code: code })
      .select()
      .single();
    if (!error) {
      // Vincula o usuário ao couple
      const { error: linkErr } = await supa
        .from("heat_profiles")
        .update({ couple_id: data.id })
        .eq("id", userId);
      if (linkErr) throw linkErr;
      return data;
    }
    if (error.code !== "23505") throw error; // 23505 = unique_violation
  }
  throw new Error("Não foi possível gerar código único");
}

export async function joinCouple(userId: string, pairCode: string) {
  const { data: couple, error } = await supa
    .from("heat_couples")
    .select("*")
    .eq("pair_code", pairCode)
    .maybeSingle();
  if (error) throw error;
  if (!couple) throw new Error("Código inválido");

  // Verifica se já tem 2 pessoas no couple
  const { data: members, error: mErr } = await supa
    .from("heat_profiles")
    .select("id")
    .eq("couple_id", couple.id);
  if (mErr) throw mErr;
  if (members && members.length >= 2) throw new Error("Esse casal já está completo");

  // Vincula
  const { error: linkErr } = await supa
    .from("heat_profiles")
    .update({ couple_id: couple.id })
    .eq("id", userId);
  if (linkErr) throw linkErr;

  return couple;
}

export async function getCoupleMembers(coupleId: string) {
  const { data, error } = await supa
    .from("heat_profiles")
    .select("id, nickname, persona_name, avatar_url")
    .eq("couple_id", coupleId);
  if (error) throw error;
  return data;
}
