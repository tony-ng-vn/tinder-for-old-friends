import type { AIService } from "@relationship-memory/shared";

import { CursorComposerProvider } from "./cursor-provider";
import { getTestStubAIService, StubAIService } from "./stub";

export { StubAIService, setTestStubAIService, getTestStubAIService } from "./stub";
export { CursorComposerProvider } from "./cursor-provider";

export function getAIService(): AIService {
  const testStub = getTestStubAIService();
  if (testStub) return testStub;

  const provider = process.env.AI_PROVIDER ?? "stub";
  if (provider === "cursor") {
    return new CursorComposerProvider();
  }
  return new StubAIService();
}
