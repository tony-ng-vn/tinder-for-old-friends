import type { ImageMimeType } from "./constants";
import type { ExtractionResult, KeptEncounterSummary, SearchMatch } from "./types";

export interface AIService {
  extractEncounterFromImage(input: {
    eventName: string;
    imageBase64: string;
    mimeType: ImageMimeType;
  }): Promise<ExtractionResult>;

  rankEncounters(input: {
    query: string;
    encounters: KeptEncounterSummary[];
  }): Promise<SearchMatch[]>;
}
