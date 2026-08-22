import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (admin) return admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  admin = createClient(url, key, { auth: { persistSession: false } });
  return admin;
}

export function getCoupleSlug(): string {
  return process.env.COUPLE_SLUG ?? "miguel-rocio";
}

export function isSyncConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
