import { z } from "zod";

import { ENCOUNTER_STATUS, IMAGE_MIME_TYPES, TRIAGE_ACTIONS } from "./constants";

export const ExtractionResultSchema = z.object({
  name: z.string().nullable(),
  number: z.string().nullable(),
  location: z.string().nullable(),
  context: z.string().nullable(),
  company: z.string().nullable(),
  role: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  is_draft: z.boolean(),
  confidence: z.number().min(0).max(1),
});

export const SearchMatchSchema = z.object({
  id: z.string().uuid(),
  score: z.number().min(0).max(1),
  reason: z.string(),
});

export const SearchMatchesSchema = z.object({
  matches: z.array(SearchMatchSchema),
});

export const StartSessionRequestSchema = z.object({
  event_name: z.string().min(1).max(200),
});

export const ExtractRequestSchema = z.object({
  session_id: z.string().uuid(),
  image_base64: z.string().min(1),
  mime_type: z.enum(IMAGE_MIME_TYPES),
  storage_path: z.string().optional(),
  public_url: z.string().url().optional(),
});

export const TriageRequestSchema = z.object({
  action: z.enum(TRIAGE_ACTIONS),
  context: z.string().max(2000).optional(),
  name: z.string().max(200).optional(),
  number: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
});

export const UpdateEncounterRequestSchema = z.object({
  name: z.string().max(200).optional(),
  number: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  context: z.string().max(2000).optional(),
});

export const SearchRequestSchema = z.object({
  query: z.string().min(1).max(500),
  limit: z.number().int().min(1).max(50).optional(),
});

export const MonitoringSessionSchema = z.object({
  id: z.string().uuid(),
  event_name: z.string(),
  started_at: z.string(),
  ended_at: z.string().nullable(),
  triage_nudged_at: z.string().nullable().optional(),
  created_at: z.string(),
});

export const CaptureSchema = z.object({
  id: z.string().uuid(),
  session_id: z.string().uuid(),
  storage_path: z.string(),
  public_url: z.string().nullable(),
  mime_type: z.string(),
  created_at: z.string(),
});

export const EncounterSchema = z.object({
  id: z.string().uuid(),
  session_id: z.string().uuid(),
  capture_id: z.string().uuid().nullable(),
  event_name: z.string(),
  name: z.string().nullable(),
  number: z.string().nullable(),
  location: z.string().nullable(),
  context: z.string().nullable(),
  company: z.string().nullable(),
  role: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  status: z.enum(ENCOUNTER_STATUS),
  is_draft: z.boolean(),
  extraction_confidence: z.number().nullable(),
  raw_extraction: z.unknown().nullable(),
  triaged_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
