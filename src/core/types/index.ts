// Core types — reutilizáveis no Expo
export type Intensity = "leve" | "media" | "picante";

export type Couple = {
  id: string;
  pair_code: string;
  streak_days: number;
  couple_xp: number;
  last_interaction_at: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  couple_id: string | null;
  nickname: string | null;
  persona_name: string | null;
  avatar_url: string | null;
  pin_hash: string | null;
  bio: string | null;
  intensity_pref: Intensity;
  in_persona_mode: boolean;
  created_at: string;
};

export type HeatMessage = {
  id: string;
  couple_id: string;
  sender_id: string;
  type: "text" | "photo" | "quick_provocation";
  content: string | null;
  media_url: string | null;
  is_one_view: boolean;
  viewed_at: string | null;
  screenshot_detected: boolean;
  expires_at: string | null;
  created_at: string;
};

export type Provocation = {
  id: string;
  text: string;
  intensity: Intensity;
  category: string | null;
  gender_target: "any" | "female" | "male";
  created_at: string;
};
