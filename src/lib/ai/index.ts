import type { AIService } from "@relationship-memory/shared";

import { CursorComposerProvider } from "./cursor-provider";
import { getStubAIService, getTestStubAIService } from "./stub";

export { StubAIService, setTestStubAIService, getTestStubAIService, getStubAIService } from "./stub";
export { CursorComposerProvider } from "./cursor-provider";

export type ExtractionSource = "stub" | "cursor";

export function getExtractionSource(): ExtractionSource {
  const provider = process.env.AI_PROVIDER ?? "stub";
  return provider === "cursor" ? "cursor" : "stub";
}

export function getAIService(): AIService {
  const testStub = getTestStubAIService();
  if (testStub) return testStub;

  if (getExtractionSource() === "cursor") {
    return new CursorComposerProvider();
  }
  return getStubAIService();
}
