import type { ExtractionResult, KeptEncounterSummary, TriageAction } from "@relationship-memory/shared";

import { getAIService } from "./ai";
import { getActiveSession, insertCapture, insertEncounterFromExtraction } from "./db";
import { enrichEncounter, enrichEncounters } from "./encounter-enrich";
import { getStore } from "./store";
import { createServiceClient } from "./supabase";

export async function startSession(eventName: string) {
  const mem = getStore();
  if (mem) return mem.createSession(eventName);

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("monitoring_sessions")
    .insert({ event_name: eventName })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Failed to create session");
  return data;
}

export async function extractCapture(input: {
  sessionId: string;
  imageBase64: string;
  mimeType: "image/png" | "image/jpeg" | "image/gif" | "image/webp";
  storagePath?: string;
  publicUrl?: string;
}) {
  const mem = getStore();
  const ai = getAIService();

  if (mem) {
    const session = mem.getSession(input.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.ended_at) throw new Error("Session already ended");
    const imageDataUrl = `data:${input.mimeType};base64,${input.imageBase64}`;
    const capture = mem.insertCapture({
      sessionId: input.sessionId,
      mimeType: input.mimeType,
      storagePath: input.storagePath,
      publicUrl: input.publicUrl,
      imageDataUrl,
    });
    const parsed = await ai.extractEncounterFromImage({
      eventName: session.event_name,
      imageBase64: input.imageBase64,
      mimeType: input.mimeType,
    });
    const encounter = mem.insertEncounter({
      sessionId: input.sessionId,
      captureId: capture.id,
      eventName: session.event_name,
      parsed,
    });
    return { capture, encounter: enrichEncounter(mem, encounter), extraction: parsed };
  }

  const session = await getActiveSession(input.sessionId);
  if (!session) throw new Error("Session not found");
  if (session.ended_at) throw new Error("Session already ended");

  const capture = await insertCapture({
    sessionId: input.sessionId,
    mimeType: input.mimeType,
    storagePath: input.storagePath,
    publicUrl: input.publicUrl,
  });

  const parsed = await ai.extractEncounterFromImage({
    eventName: session.event_name,
    imageBase64: input.imageBase64,
    mimeType: input.mimeType,
  });

  const encounter = await insertEncounterFromExtraction({
    sessionId: input.sessionId,
    captureId: capture.id,
    eventName: session.event_name,
    parsed,
  });

  return { capture, encounter, extraction: parsed };
}

export async function listPendingSessions() {
  const mem = getStore();
  if (mem) {
    return { sessions: mem.listSessionsWithPending() };
  }

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("encounters")
    .select("session_id, monitoring_sessions ( id, event_name, ended_at )")
    .eq("status", "pending");

  const grouped = new Map<
    string,
    { session_id: string; event_name: string; pending_count: number; ended_at: string | null }
  >();
  for (const row of data ?? []) {
    const raw = row.monitoring_sessions as
      | { id: string; event_name: string; ended_at: string | null }
      | { id: string; event_name: string; ended_at: string | null }[]
      | null;
    const session = Array.isArray(raw) ? raw[0] : raw;
    if (!session) continue;
    const existing = grouped.get(session.id);
    if (existing) {
      existing.pending_count += 1;
    } else {
      grouped.set(session.id, {
        session_id: session.id,
        event_name: session.event_name,
        pending_count: 1,
        ended_at: session.ended_at,
      });
    }
  }
  return { sessions: [...grouped.values()] };
}

export async function getSessionQueue(sessionId: string) {
  const mem = getStore();
  if (mem) {
    const pending = mem.pendingEncounters(sessionId);
    return { queue: enrichEncounters(mem, pending) };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("encounters")
    .select("*, captures ( id, public_url, storage_path, mime_type )")
    .eq("session_id", sessionId)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const queue = (data ?? []).map((e) => {
    const capture = e.captures as { public_url: string | null } | null;
    return { ...e, capture_url: capture?.public_url ?? null };
  });
  return { queue };
}

export async function endSession(sessionId: string) {
  const mem = getStore();
  if (mem) {
    mem.endSession(sessionId);
    return {
      session_id: sessionId,
      queue: enrichEncounters(mem, mem.pendingEncounters(sessionId)),
    };
  }

  const supabase = createServiceClient();
  await supabase
    .from("monitoring_sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", sessionId)
    .is("ended_at", null);

  const { data: queue } = await supabase
    .from("encounters")
    .select("*, captures ( id, public_url, storage_path, mime_type )")
    .eq("session_id", sessionId)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return { session_id: sessionId, queue: queue ?? [] };
}

export async function updateEncounter(
  encounterId: string,
  fields: { name?: string; number?: string; location?: string; context?: string },
) {
  const mem = getStore();
  if (mem) {
    const encounter = mem.updateEncounter(encounterId, fields);
    if (!encounter) throw new Error("Encounter not found");
    return encounter;
  }

  const supabase = createServiceClient();
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    ...fields,
  };

  const { data, error } = await supabase
    .from("encounters")
    .update(updates)
    .eq("id", encounterId)
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Encounter not found");
  return data;
}

export async function triageEncounter(
  encounterId: string,
  action: TriageAction,
  fields: { context?: string; name?: string; number?: string; location?: string },
) {
  const mem = getStore();
  if (mem) {
    const encounter = mem.triageEncounter(encounterId, action, fields);
    if (!encounter) throw new Error("Encounter not found");
    return encounter;
  }

  const supabase = createServiceClient();
  const updates: Record<string, unknown> = {
    status: action === "keep" ? "kept" : "forgotten",
    triaged_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...fields,
  };

  const { data, error } = await supabase
    .from("encounters")
    .update(updates)
    .eq("id", encounterId)
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Encounter not found");
  return data;
}

export async function searchEncounters(query: string, limit = 10) {
  const mem = getStore();
  const ai = getAIService();

  const kept: KeptEncounterSummary[] = mem
    ? mem.keptEncounters().map((e) => ({
        id: e.id,
        name: e.name,
        number: e.number,
        location: e.location,
        context: e.context,
        company: e.company,
        role: e.role,
        event_name: e.event_name,
        linkedin_url: e.linkedin_url,
      }))
    : await (async () => {
        const supabase = createServiceClient();
        const { data } = await supabase
          .from("encounters")
          .select(
            "id, name, number, location, context, company, role, event_name, linkedin_url",
          )
          .eq("status", "kept")
          .order("created_at", { ascending: false })
          .limit(200);
        return data ?? [];
      })();

  if (!kept.length) return { query, matches: [] as Array<KeptEncounterSummary & { score: number; reason: string }> };

  const ranked = await ai.rankEncounters({ query, encounters: kept });
  const byId = new Map(kept.map((e) => [e.id, e]));

  const matches = ranked
    .slice(0, limit)
    .map((m) => {
      const encounter = byId.get(m.id);
      if (!encounter) return null;
      const captureUrl = mem
        ? (() => {
            const full = mem.encounters.get(m.id);
            return full ? enrichEncounter(mem, full).capture_url : null;
          })()
        : null;
      return { ...encounter, score: m.score, reason: m.reason, capture_url: captureUrl };
    })
    .filter(Boolean);

  return { query, matches };
}
