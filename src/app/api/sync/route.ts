import { NextResponse } from "next/server";
import { mergeCoupleSync } from "@/lib/couple-sync-defaults";
import { isSyncConfigured, readCouple, writeCouple } from "@/lib/supabase/admin";
import type { CoupleSyncData } from "@/types/couple-sync";

export async function GET() {
  if (!isSyncConfigured()) {
    return NextResponse.json({ configured: false, data: null });
  }
  try {
    const row = await readCouple();
    if (!row) return NextResponse.json({ configured: true, data: null });
    const payload = mergeCoupleSync(row.payload as Partial<CoupleSyncData>);
    payload.updatedAt = row.updated_at ?? payload.updatedAt;
    return NextResponse.json({ configured: true, data: payload });
  } catch (e) {
    return NextResponse.json({ configured: true, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isSyncConfigured()) {
    return NextResponse.json({ configured: false, error: "Sync not configured" }, { status: 503 });
  }
  let body: Partial<CoupleSyncData>;
  try {
    body = (await request.json()) as Partial<CoupleSyncData>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const payload = mergeCoupleSync(body);
    payload.updatedAt = await writeCouple(payload);
    return NextResponse.json({ ok: true, data: payload });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
