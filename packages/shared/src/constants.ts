export const ENCOUNTER_STATUS = ["pending", "kept", "forgotten"] as const;
export type EncounterStatus = (typeof ENCOUNTER_STATUS)[number];

export const TRIAGE_ACTIONS = ["keep", "forget"] as const;
export type TriageAction = (typeof TRIAGE_ACTIONS)[number];

export const IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
] as const;
export type ImageMimeType = (typeof IMAGE_MIME_TYPES)[number];

export const MOBILE_ROUTES = {
  Home: "Home",
  Monitoring: "Monitoring",
  Triage: "Triage",
  Memory: "Memory",
  Search: "Search",
} as const;

export function captureStoragePath(sessionId: string, captureId: string, ext: string) {
  return `captures/sessions/${sessionId}/${captureId}.${ext}`;
}
