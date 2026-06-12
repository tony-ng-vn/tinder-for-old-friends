import { createHash } from "node:crypto";

import type { AIService } from "@relationship-memory/shared";
import type { ExtractionResult, ImageMimeType, KeptEncounterSummary, SearchMatch } from "@relationship-memory/shared";

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

/** Demo person 3 */
export const DEMO_PERSON_3: ExtractionResult = {
  name: "Jordan Lee",
  number: null,
  location: "New York",
  context: "Discussed AI agents for healthcare",
  company: "HealthAI",
  role: "Founder",
  linkedin_url: null,
  is_draft: false,
  confidence: 0.88,
};

/** Demo person 4 */
export const DEMO_PERSON_4: ExtractionResult = {
  name: "Sam Rivera",
  number: null,
  location: "Austin",
  context: "Met at the after-party",
  company: "Vercel",
  role: "DevRel",
  linkedin_url: null,
  is_draft: false,
  confidence: 0.85,
};

const DEMO_EXTRACTIONS = [
  DEMO_PERSON_FULL,
  DEMO_PERSON_DRAFT,
  DEMO_PERSON_3,
  DEMO_PERSON_4,
];

const DEFAULT_EXTRACTION: ExtractionResult = DEMO_PERSON_FULL;

function demoIndexForImage(imageBase64: string): number {
  const hash = createHash("sha256").update(imageBase64).digest();
  return hash.readUInt32BE(0) % DEMO_EXTRACTIONS.length;
}

export class StubAIService implements AIService {
  private extractionIndex = 0;

  constructor(
    private fixedExtraction?: ExtractionResult,
    private matches: SearchMatch[] = [],
  ) {}

  async extractEncounterFromImage(input: {
    eventName: string;
    imageBase64: string;
    mimeType: ImageMimeType;
  }): Promise<ExtractionResult> {
    if (this.fixedExtraction) return this.fixedExtraction;
    const hashIdx = demoIndexForImage(input.imageBase64);
    const cycleIdx = this.extractionIndex % DEMO_EXTRACTIONS.length;
    this.extractionIndex += 1;
    return DEMO_EXTRACTIONS[hashIdx] ?? DEMO_EXTRACTIONS[cycleIdx]!;
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
let stubInstance: StubAIService | null = null;

export function getStubAIService(): StubAIService {
  if (!stubInstance) stubInstance = new StubAIService();
  return stubInstance;
}

export function setTestStubAIService(stub: StubAIService | null) {
  testStub = stub;
}

export function getTestStubAIService() {
  return testStub;
}

export { DEFAULT_EXTRACTION };
