import type { AIService } from "@relationship-memory/shared";
import type { ExtractionResult, KeptEncounterSummary, SearchMatch } from "@relationship-memory/shared";

/** Demo person 1 — full extraction */
export const DEMO_PERSON_FULL: ExtractionResult = {
  name: "Alex Chen",
  number: null,
  location: "San Francisco",
  context: "Talked about payments infra",
  company: "Stripe",
  role: "Engineer",
  linkedin_url: "https://linkedin.com/in/alexchen",
  is_draft: false,
  confidence: 0.92,
};

/** Demo person 2 — partial draft */
export const DEMO_PERSON_DRAFT: ExtractionResult = {
  name: null,
  number: null,
  location: null,
  context: null,
  company: "Acme Corp",
  role: null,
  linkedin_url: null,
  is_draft: true,
  confidence: 0.35,
};

const DEMO_EXTRACTIONS = [DEMO_PERSON_FULL, DEMO_PERSON_DRAFT];

const DEFAULT_EXTRACTION: ExtractionResult = DEMO_PERSON_FULL;

export class StubAIService implements AIService {
  private extractionIndex = 0;

  constructor(
    private fixedExtraction?: ExtractionResult,
    private matches: SearchMatch[] = [],
  ) {}

  async extractEncounterFromImage(): Promise<ExtractionResult> {
    if (this.fixedExtraction) return this.fixedExtraction;
    const idx = this.extractionIndex % DEMO_EXTRACTIONS.length;
    this.extractionIndex += 1;
    return DEMO_EXTRACTIONS[idx]!;
  }

  async rankEncounters(input: {
    query: string;
    encounters: KeptEncounterSummary[];
  }): Promise<SearchMatch[]> {
    if (this.matches.length > 0) return this.matches;

    const q = input.query.toLowerCase();
    return input.encounters
      .map((e) => {
        const haystack = [e.name, e.company, e.role, e.context, e.event_name, e.location]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const score = haystack.includes(q) ? 0.9 : q.split(" ").some((w) => haystack.includes(w)) ? 0.6 : 0;
        return score > 0
          ? { id: e.id, score, reason: `Matched "${input.query}" in encounter fields` }
          : null;
      })
      .filter((m): m is SearchMatch => m !== null)
      .sort((a, b) => b.score - a.score);
  }
}

let testStub: StubAIService | null = null;

export function setTestStubAIService(stub: StubAIService | null) {
  testStub = stub;
}

export function getTestStubAIService() {
  return testStub;
}

export { DEFAULT_EXTRACTION };
