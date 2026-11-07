import { NextRequest, NextResponse } from "next/server";
import * as webpush from "web-push";
import { supaAdmin } from "@/data/supabase-admin";


const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY!;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT!;

if (VAPID_PUBLIC && VAPID_PRIVATE && VAPID_SUBJECT) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "no auth" }, { status: 401 });

    const admin = supaAdmin();
    const { data: { user }, error: uerr } = await admin.auth.getUser(token);
    if (uerr || !user) return NextResponse.json({ error: "invalid auth" }, { status: 401 });

    const body = await req.json();
    const { to_user_id, title, body: msgBody, url } = body;
    if (!to_user_id) return NextResponse.json({ error: "no to_user_id" }, { status: 400 });

    // Verifica que to_user_id é parceiro (mesmo couple_id)
    const { data: me } = await admin.from("heat_profiles").select("couple_id").eq("id", user.id).maybeSingle();
    const { data: them } = await admin.from("heat_profiles").select("couple_id").eq("id", to_user_id).maybeSingle();
    if (!me?.couple_id || me.couple_id !== them?.couple_id) {
      return NextResponse.json({ error: "not partners" }, { status: 403 });
    }

    // Busca subscriptions do parceiro
    const { data: subs, error: serr } = await admin
      .from("heat_push_subscriptions")
      .select("*")
      .eq("user_id", to_user_id);
    if (serr) return NextResponse.json({ error: serr.message }, { status: 500 });
    if (!subs || subs.length === 0) return NextResponse.json({ ok: true, sent: 0 });

    const payload = JSON.stringify({
      title: title || "🔥 Nova provocação",
      body: msgBody || "Toque pra ver",
      url: url || "/chat",
    });

    let sent = 0;
    const failedIds: string[] = [];
    await Promise.all(
      subs.map(async (s: any) => {
        try {
          await webpush.sendNotification({
            endpoint: s.endpoint,
            keys: { p256dh: s.p256dh, auth: s.auth_key },
          }, payload);
          sent++;
        } catch (e: any) {
          if (e.statusCode === 404 || e.statusCode === 410) failedIds.push(s.id);
        }
      })
    );

    // Limpa subs mortas
    if (failedIds.length > 0) {
      await admin.from("heat_push_subscriptions").delete().in("id", failedIds);
    }

    return NextResponse.json({ ok: true, sent });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "error" }, { status: 500 });
  }
}
