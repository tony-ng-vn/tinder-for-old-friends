export const EXTRACTION_SYSTEM = `You extract structured contact info from event networking screenshots.
Return ONLY valid JSON. No markdown fences. No commentary.`;

export function buildExtractionPrompt(eventName: string): string {
  return `${EXTRACTION_SYSTEM}

Event where user met this person: "${eventName}"

Analyze the image. It is usually a LinkedIn profile screenshot, business card, or chat with contact info.

Return this JSON shape:
{
  "name": string | null,
  "number": string | null,
  "location": string | null,
  "context": string | null,
  "company": string | null,
  "role": string | null,
  "linkedin_url": string | null,
  "is_draft": boolean,
  "confidence": number
}

Rules:
- "context" = anything visible about what they do, headline, or why they might matter. Not a user note.
- Set is_draft=true if you cannot confidently read a person's name.
- confidence is 0.0 to 1.0.
- Use null for unknown fields. Do not invent people or facts not visible in the image.`;
}

export const SEARCH_SYSTEM = `You search a user's kept networking encounters.
Return ONLY valid JSON. No markdown fences. No commentary.`;

export function buildSearchPrompt(
  query: string,
  encounters: Array<{
    id: string;
    name: string | null;
    number: string | null;
    location: string | null;
    context: string | null;
    company: string | null;
    role: string | null;
    event_name: string;
    linkedin_url: string | null;
  }>,
): string {
  return `${SEARCH_SYSTEM}

User query: "${query}"

Encounters (ONLY search within this list — never invent people):
${JSON.stringify(encounters, null, 2)}

Return this JSON shape:
{
  "matches": [
    {
      "id": string,
      "score": number,
      "reason": string
    }
  ]
}

Rules:
- score is 0.0 to 1.0 (relevance to query).
- Include at most 10 matches, sorted by score descending.
- Only return ids that exist in the input list.
- If nothing matches, return { "matches": [] }.`;
}
