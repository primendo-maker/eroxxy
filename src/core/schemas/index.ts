import { z } from "zod";

export const signUpSchema = z.object({
  nickname: z.string().trim().min(2, "Mínimo 2 caracteres").max(24, "Máximo 24"),
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(1, "Obrigatório"),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const joinCoupleSchema = z.object({
  pair_code: z.string().trim().length(6, "Código precisa ter 6 dígitos").regex(/^\d{6}$/, "Só números"),
});
export type JoinCoupleInput = z.infer<typeof joinCoupleSchema>;
