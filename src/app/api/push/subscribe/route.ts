import { NextRequest, NextResponse } from "next/server";
import { supaAdmin } from "@/data/supabase-admin";


export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "no auth" }, { status: 401 });

    const admin = supaAdmin();
    const { data: { user }, error: uerr } = await admin.auth.getUser(token);
    if (uerr || !user) return NextResponse.json({ error: "invalid auth" }, { status: 401 });

    const body = await req.json();
    const { endpoint, p256dh, auth_key, user_agent } = body;
    if (!endpoint || !p256dh || !auth_key) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }

    const { error } = await admin.from("heat_push_subscriptions").upsert({
      user_id: user.id,
      endpoint,
      p256dh,
      auth_key,
      user_agent: user_agent || null,
    }, { onConflict: "user_id,endpoint" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "error" }, { status: 500 });
  }
}
