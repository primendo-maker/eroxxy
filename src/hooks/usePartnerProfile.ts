"use client";
import { useEffect, useState } from "react";
import { supa } from "@/data/supabase";

export function usePartnerProfile(coupleId: string | null, myUserId: string | null) {
  const [partner, setPartner] = useState<any>(null);

  useEffect(() => {
    if (!coupleId || !myUserId) return;
    let channelRef: any = null;
    let cancel = false;

    async function fetchPartner() {
      const { data } = await supa
        .from("heat_profiles")
        .select("*")
        .eq("couple_id", coupleId)
        .neq("id", myUserId)
        .maybeSingle();
      if (!cancel) setPartner(data);
    }
    fetchPartner();

    channelRef = supa
      .channel(`partner_${coupleId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "heat_profiles",
        filter: `couple_id=eq.${coupleId}`,
      }, (payload: any) => {
        if (payload.new.id !== myUserId) setPartner(payload.new);
      })
      .subscribe();

    return () => {
      cancel = true;
      if (channelRef) supa.removeChannel(channelRef);
    };
  }, [coupleId, myUserId]);

  return partner;
}
