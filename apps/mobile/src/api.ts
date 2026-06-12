const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? res.statusText);
  return json as T;
}

export type Encounter = {
  id: string;
  name: string | null;
  number: string | null;
  role: string | null;
  company: string | null;
  event_name: string;
  context: string | null;
  location: string | null;
  is_draft: boolean;
  status: string;
  capture_url?: string | null;
  captures?: { public_url: string | null } | null;
};

export type PendingSession = {
  session_id: string;
  event_name: string;
  pending_count: number;
  ended_at: string | null;
};

export const api = {
  startSession: (event_name: string) =>
    request<{ session: { id: string; event_name: string } }>("/api/sessions", {
      method: "POST",
      body: JSON.stringify({ event_name }),
    }),

  listPendingSessions: () =>
    request<{ sessions: PendingSession[] }>("/api/sessions"),

  getSessionQueue: (id: string) =>
    request<{ queue: Encounter[] }>(`/api/sessions/${id}/queue`),

  extract: (input: {
    session_id: string;
    image_base64: string;
    mime_type: "image/png" | "image/jpeg" | "image/gif" | "image/webp";
  }) =>
    request<{
      encounter: Encounter;
      extraction_source: "stub" | "cursor";
    }>("/api/extract", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  endSession: (id: string) =>
    request<{ queue: Encounter[] }>(`/api/sessions/${id}/end`, { method: "POST" }),

  updateEncounter: (
    id: string,
    body: { name?: string; number?: string; location?: string; context?: string },
  ) =>
    request<{ encounter: Encounter }>(`/api/encounters/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  triage: (
    id: string,
    body: { action: "keep" | "forget"; context?: string; name?: string; number?: string; location?: string },
  ) =>
    request<{ encounter: Encounter }>(`/api/encounters/${id}/triage`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  search: (query: string) =>
    request<{ matches: Array<Encounter & { score: number; reason: string }> }>(
      "/api/search",
      { method: "POST", body: JSON.stringify({ query }) },
    ),

  listEncounters: (status = "kept") =>
    request<{ encounters: Encounter[] }>(`/api/encounters?status=${status}`),
};

export function encounterImageUri(encounter: Encounter): string | null {
  return encounter.capture_url ?? encounter.captures?.public_url ?? null;
}
