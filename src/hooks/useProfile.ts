"use client";
import { useEffect, useState } from "react";
import { getProfile } from "@/data/auth";
import type { Profile } from "@/core/types";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const p = await getProfile();
        setProfile(p as Profile | null);
      } finally { setLoading(false); }
    })();
  }, []);
  return { profile, loading };
}
