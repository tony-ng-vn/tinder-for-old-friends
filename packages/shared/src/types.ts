import type { z } from "zod";

import type {
  CaptureSchema,
  EncounterSchema,
  ExtractionResultSchema,
  MonitoringSessionSchema,
  SearchMatchSchema,
} from "./schemas";
import type { EncounterStatus, ImageMimeType, TriageAction } from "./constants";

export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;
export type SearchMatch = z.infer<typeof SearchMatchSchema>;
export type MonitoringSession = z.infer<typeof MonitoringSessionSchema>;
export type Capture = z.infer<typeof CaptureSchema>;
export type Encounter = z.infer<typeof EncounterSchema>;

export type { EncounterStatus, ImageMimeType, TriageAction };

export type KeptEncounterSummary = Pick<
  Encounter,
  | "id"
  | "name"
  | "number"
  | "location"
  | "context"
  | "company"
  | "role"
  | "event_name"
  | "linkedin_url"
>;

export type SearchResultEncounter = KeptEncounterSummary & {
  score: number;
  reason: string;
};
