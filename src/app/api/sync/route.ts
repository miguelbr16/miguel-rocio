import { NextResponse } from "next/server";
import { mergeCoupleSync } from "@/lib/couple-sync-defaults";
import { getCoupleSlug, getSupabaseAdmin, isSyncConfigured } from "@/lib/supabase/admin";
import type { CoupleSyncData } from "@/types/couple-sync";

export async function GET() {
  if (!isSyncConfigured()) {
    return NextResponse.json({ configured: false, data: null });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false, data: null });
  }

  const slug = getCoupleSlug();
  const { data, error } = await supabase
    .from("couple_data")
    .select("payload, updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ configured: true, error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ configured: true, data: null });
  }

  const payload = mergeCoupleSync(data.payload as Partial<CoupleSyncData>);
  payload.updatedAt = data.updated_at ?? payload.updatedAt;
  return NextResponse.json({ configured: true, data: payload });
}

export async function PUT(request: Request) {
  if (!isSyncConfigured()) {
    return NextResponse.json({ configured: false, error: "Sync not configured" }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false, error: "Sync not configured" }, { status: 503 });
  }

  let body: Partial<CoupleSyncData>;
  try {
    body = (await request.json()) as Partial<CoupleSyncData>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = getCoupleSlug();
  const payload = mergeCoupleSync(body);
  const updatedAt = new Date().toISOString();
  payload.updatedAt = updatedAt;

  const { error } = await supabase.from("couple_data").upsert(
    {
      slug,
      payload,
      updated_at: updatedAt,
    },
    { onConflict: "slug" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data: payload });
}
