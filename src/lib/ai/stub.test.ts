import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { StubAIService } from "./stub";

describe("StubAIService", () => {
  it("returns different demo extractions for different images", async () => {
    const stub = new StubAIService();
    const base = {
      eventName: "Demo Day",
      mimeType: "image/png" as const,
    };

    const a = await stub.extractEncounterFromImage({
      ...base,
      imageBase64: "a".repeat(64),
    });
    const b = await stub.extractEncounterFromImage({
      ...base,
      imageBase64: "b".repeat(64),
    });
    const c = await stub.extractEncounterFromImage({
      ...base,
      imageBase64: "c".repeat(128),
    });

    const names = new Set([a.name, b.name, c.name].filter(Boolean));
    assert.ok(names.size >= 2, "expected at least two distinct demo names");
  });

  it("returns the same demo extraction for the same image", async () => {
    const stub = new StubAIService();
    const input = {
      eventName: "Demo Day",
      mimeType: "image/jpeg" as const,
      imageBase64: "same-image-bytes",
    };

    const first = await stub.extractEncounterFromImage(input);
    const second = await stub.extractEncounterFromImage(input);
    assert.deepEqual(first, second);
  });
});
