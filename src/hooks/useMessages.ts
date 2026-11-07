"use client";
import { useEffect, useState, useRef } from "react";
import { supa } from "@/data/supabase";
import { listMessages } from "@/data/messages";
import type { HeatMessage } from "@/core/types";

export function useMessages(coupleId: string | null) {
  const [messages, setMessages] = useState<HeatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!coupleId) return;
    let cancel = false;
    (async () => {
      try {
        const data = await listMessages(coupleId);
        if (!cancel) setMessages(data);
      } finally { if (!cancel) setLoading(false); }
    })();

    const ch = supa
      .channel(`heat_msgs_${coupleId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "heat_messages",
        filter: `couple_id=eq.${coupleId}`,
      }, (payload: any) => {
        setMessages(prev => prev.some(m => m.id === payload.new.id) ? prev : [...prev, payload.new as HeatMessage]);
      })
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "heat_messages",
        filter: `couple_id=eq.${coupleId}`,
      }, (payload: any) => {
        setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m));
      })
      .subscribe();
    channelRef.current = ch;

    return () => {
      cancel = true;
      if (channelRef.current) supa.removeChannel(channelRef.current);
    };
  }, [coupleId]);

  return { messages, loading };
}
