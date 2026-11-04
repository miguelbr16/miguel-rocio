import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Sincronización Miguel ↔ Rocío. Los datos viven en el proyecto de Supabase de
 * Momentos, pero en tablas propias (mr_*) a las que solo se llega con las
 * funciones mr_get_couple / mr_put_couple y un secreto que solo conoce el servidor.
 * Así nunca se mezcla con lo de Momentos.
 */
let client: SupabaseClient | null = null;

function config() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  const secret = process.env.MR_SYNC_SECRET;
  return { url, key, secret };
}

export function isSyncConfigured(): boolean {
  const { url, key, secret } = config();
  return Boolean(url && key && secret);
}

export function getCoupleSlug(): string {
  return process.env.COUPLE_SLUG ?? "miguel-rocio";
}

function db(): SupabaseClient | null {
  if (client) return client;
  const { url, key } = config();
  if (!url || !key) return null;
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

export async function readCouple(): Promise<{ payload: unknown; updated_at: string } | null> {
  const c = db();
  if (!c) throw new Error("Sync not configured");
  const { data, error } = await c.rpc("mr_get_couple", { p_slug: getCoupleSlug(), p_secret: config().secret });
  if (error) throw new Error(error.message);
  return (data as { payload: unknown; updated_at: string } | null) ?? null;
}

export async function writeCouple(payload: unknown): Promise<string> {
  const c = db();
  if (!c) throw new Error("Sync not configured");
  const { data, error } = await c.rpc("mr_put_couple", { p_slug: getCoupleSlug(), p_secret: config().secret, p_payload: payload });
  if (error) throw new Error(error.message);
  return data as string;
}
