import { supa } from "./supabase";
import type { SignUpInput, SignInInput } from "@/core/schemas";

export async function signUp(input: SignUpInput) {
  const { data, error } = await supa.auth.signUp({
    email: input.email,
    password: input.password,
  });
  if (error) throw error;
  if (!data.user) throw new Error("Falha ao criar conta");

  // Cria heat_profile
  const { error: profileErr } = await supa.from("heat_profiles").insert({
    id: data.user.id,
    nickname: input.nickname,
  });
  if (profileErr) throw profileErr;

  return data.user;
}

export async function signIn(input: SignInInput) {
  const { data, error } = await supa.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const { error } = await supa.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data } = await supa.auth.getSession();
  return data.session;
}

export async function getProfile() {
  const session = await getSession();
  if (!session) return null;
  const { data, error } = await supa
    .from("heat_profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
