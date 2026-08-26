import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let admin: SupabaseClient | null = null;

function getSupabaseUrl(): string | undefined {
  // Prefer server-only name (avoids Vercel NEXT_PUBLIC_ warning).
  // NEXT_PUBLIC_SUPABASE_URL kept as fallback for older deploys.
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (admin) return admin;
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  admin = createClient(url, key, { auth: { persistSession: false } });
  return admin;
}

export function getCoupleSlug(): string {
  return process.env.COUPLE_SLUG ?? "miguel-rocio";
}

export function isSyncConfigured(): boolean {
  return Boolean(getSupabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
