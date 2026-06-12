import { captureStoragePath } from "@relationship-memory/shared";
import type { ExtractionResult } from "@relationship-memory/shared";

import { createServiceClient } from "./supabase";

export async function getActiveSession(sessionId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("monitoring_sessions")
    .select("id, event_name, ended_at")
    .eq("id", sessionId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function insertCapture(input: {
  sessionId: string;
  captureId?: string;
  storagePath?: string;
  publicUrl?: string;
  mimeType: string;
}) {
  const supabase = createServiceClient();
  const captureId = input.captureId ?? crypto.randomUUID();
  const ext = input.mimeType.split("/")[1] ?? "png";
  const storagePath =
    input.storagePath ?? captureStoragePath(input.sessionId, captureId, ext);

  const { data, error } = await supabase
    .from("captures")
    .insert({
      id: captureId,
      session_id: input.sessionId,
      storage_path: storagePath,
      public_url: input.publicUrl ?? null,
      mime_type: input.mimeType,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to insert capture");
  return { id: data.id, storage_path: storagePath };
}

export async function insertEncounterFromExtraction(input: {
  sessionId: string;
  captureId: string;
  eventName: string;
  parsed: ExtractionResult;
}) {
  const supabase = createServiceClient();
  const context =
    input.parsed.context ??
    ([input.parsed.role, input.parsed.company].filter(Boolean).join(" @ ") ||
      null);

  const { data, error } = await supabase
    .from("encounters")
    .insert({
      session_id: input.sessionId,
      capture_id: input.captureId,
      event_name: input.eventName,
      name: input.parsed.name,
      number: input.parsed.number,
      location: input.parsed.location,
      context,
      company: input.parsed.company,
      role: input.parsed.role,
      linkedin_url: input.parsed.linkedin_url,
      is_draft: input.parsed.is_draft || !input.parsed.name,
      extraction_confidence: input.parsed.confidence,
      raw_extraction: input.parsed,
      status: "pending",
    })
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to insert encounter");
  return data;
}
