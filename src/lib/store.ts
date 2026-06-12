import type { Encounter, MonitoringSession } from "@relationship-memory/shared";
import type { ExtractionResult } from "@relationship-memory/shared";
import { captureStoragePath } from "@relationship-memory/shared";

type CaptureRow = {
  id: string;
  session_id: string;
  storage_path: string;
  public_url: string | null;
  image_data_url: string | null;
  mime_type: string;
  created_at: string;
};

export class InMemoryStore {
  sessions = new Map<string, MonitoringSession>();
  captures = new Map<string, CaptureRow>();
  encounters = new Map<string, Encounter>();

  createSession(eventName: string): MonitoringSession {
    const session: MonitoringSession = {
      id: crypto.randomUUID(),
      event_name: eventName,
      started_at: new Date().toISOString(),
      ended_at: null,
      triage_nudged_at: null,
      created_at: new Date().toISOString(),
    };
    this.sessions.set(session.id, session);
    return session;
  }

  getSession(id: string) {
    return this.sessions.get(id) ?? null;
  }

  endSession(id: string) {
    const s = this.sessions.get(id);
    if (!s) return null;
    s.ended_at = new Date().toISOString();
    this.sessions.set(id, s);
    return s;
  }

  insertCapture(input: {
    sessionId: string;
    mimeType: string;
    storagePath?: string;
    publicUrl?: string;
    imageDataUrl?: string;
  }) {
    const id = crypto.randomUUID();
    const ext = input.mimeType.split("/")[1] ?? "png";
    const row: CaptureRow = {
      id,
      session_id: input.sessionId,
      storage_path:
        input.storagePath ?? captureStoragePath(input.sessionId, id, ext),
      public_url: input.publicUrl ?? null,
      image_data_url: input.imageDataUrl ?? null,
      mime_type: input.mimeType,
      created_at: new Date().toISOString(),
    };
    this.captures.set(id, row);
    return row;
  }

  insertEncounter(input: {
    sessionId: string;
    captureId: string;
    eventName: string;
    parsed: ExtractionResult;
  }) {
    const context =
      input.parsed.context ??
      ([input.parsed.role, input.parsed.company].filter(Boolean).join(" @ ") ||
        null);

    const row: Encounter = {
      id: crypto.randomUUID(),
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
      triaged_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.encounters.set(row.id, row);
    return row;
  }

  getCapture(captureId: string | null) {
    if (!captureId) return null;
    return this.captures.get(captureId) ?? null;
  }

  pendingEncounters(sessionId: string) {
    return [...this.encounters.values()].filter(
      (e) => e.session_id === sessionId && e.status === "pending",
    );
  }

  pendingEncountersWithCaptures(sessionId: string) {
    return this.pendingEncounters(sessionId).map((encounter) => {
      const capture = this.getCapture(encounter.capture_id);
      return {
        ...encounter,
        captures: capture
          ? {
              id: capture.id,
              public_url: capture.public_url,
              storage_path: capture.storage_path,
              mime_type: capture.mime_type,
            }
          : null,
      };
    });
  }

  keptEncountersWithCaptures() {
    return this.keptEncounters().map((encounter) => {
      const capture = this.getCapture(encounter.capture_id);
      return {
        ...encounter,
        captures: capture
          ? {
              id: capture.id,
              public_url: capture.public_url,
              storage_path: capture.storage_path,
              mime_type: capture.mime_type,
            }
          : null,
      };
    });
  }

  updateEncounter(
    id: string,
    fields: Partial<Pick<Encounter, "name" | "number" | "location" | "context">>,
  ) {
    const e = this.encounters.get(id);
    if (!e) return null;
    Object.assign(e, fields);
    e.updated_at = new Date().toISOString();
    this.encounters.set(id, e);
    return e;
  }

  triageEncounter(
    id: string,
    action: "keep" | "forget",
    fields: Partial<Pick<Encounter, "context" | "name" | "number" | "location">>,
  ) {
    const e = this.encounters.get(id);
    if (!e) return null;
    e.status = action === "keep" ? "kept" : "forgotten";
    e.triaged_at = new Date().toISOString();
    e.updated_at = new Date().toISOString();
    Object.assign(e, fields);
    this.encounters.set(id, e);
    return e;
  }

  keptEncounters() {
    return [...this.encounters.values()].filter((e) => e.status === "kept");
  }

  listSessionsWithPending() {
    const counts = new Map<string, number>();
    for (const e of this.encounters.values()) {
      if (e.status !== "pending") continue;
      counts.set(e.session_id, (counts.get(e.session_id) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([sessionId, pending_count]) => {
        const session = this.sessions.get(sessionId);
        if (!session) return null;
        return {
          session_id: sessionId,
          event_name: session.event_name,
          pending_count,
          ended_at: session.ended_at,
        };
      })
      .filter(Boolean);
  }
}

type StoreGlobal = typeof globalThis & { __relationshipMemoryStore?: InMemoryStore | null };

function storeGlobal(): StoreGlobal {
  return globalThis as StoreGlobal;
}

export function useInMemoryStore(store: InMemoryStore | null) {
  storeGlobal().__relationshipMemoryStore = store;
}

export function getStore(): InMemoryStore | null {
  const g = storeGlobal();
  if (process.env.USE_IN_MEMORY === "1" && !g.__relationshipMemoryStore) {
    g.__relationshipMemoryStore = new InMemoryStore();
  }
  return g.__relationshipMemoryStore ?? null;
}
