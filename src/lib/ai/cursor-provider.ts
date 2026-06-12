import {
  ExtractionResultSchema,
  SearchMatchesSchema,
  type AIService,
  type ExtractionResult,
  type KeptEncounterSummary,
  type SearchMatch,
} from "@relationship-memory/shared";

import { cursorPrompt, parseJsonFromModel } from "./cursor-client";
import { buildExtractionPrompt, buildSearchPrompt } from "./prompts";

export class CursorComposerProvider implements AIService {
  async extractEncounterFromImage(input: {
    eventName: string;
    imageBase64: string;
    mimeType: "image/png" | "image/jpeg" | "image/gif" | "image/webp";
  }): Promise<ExtractionResult> {
    const raw = await cursorPrompt({
      text: buildExtractionPrompt(input.eventName),
      images: [{ data: input.imageBase64, mimeType: input.mimeType }],
    });
    return ExtractionResultSchema.parse(parseJsonFromModel(raw));
  }

  async rankEncounters(input: {
    query: string;
    encounters: KeptEncounterSummary[];
  }): Promise<SearchMatch[]> {
    const raw = await cursorPrompt({
      text: buildSearchPrompt(input.query, input.encounters),
    });
    const parsed = SearchMatchesSchema.parse(parseJsonFromModel(raw));
    return parsed.matches;
  }
}
