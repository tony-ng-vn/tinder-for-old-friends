import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { StubAIService, setTestStubAIService } from "./ai";
import { InMemoryStore, useInMemoryStore } from "./store";
import {
  endSession,
  extractCapture,
  getSessionQueue,
  listPendingSessions,
  searchEncounters,
  startSession,
  triageEncounter,
  updateEncounter,
} from "./services";

describe("relationship memory services", () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
    useInMemoryStore(store);
    setTestStubAIService(
      new StubAIService({
        name: "Sarah Kim",
        number: null,
        location: "NYC",
        context: "Founder building healthcare agents",
        company: "HealthAI",
        role: "CEO",
        linkedin_url: null,
        is_draft: false,
        confidence: 0.9,
      }),
    );
  });

  afterEach(() => {
    useInMemoryStore(null);
    setTestStubAIService(null);
  });

  it("starts session with event_name and null ended_at", async () => {
    const session = await startSession("Vercel Ship Week");
    assert.equal(session.event_name, "Vercel Ship Week");
    assert.equal(session.ended_at, null);
  });

  it("extracts during active session", async () => {
    const session = await startSession("OpenAI DevDay");
    const result = await extractCapture({
      sessionId: session.id,
      imageBase64: "fake",
      mimeType: "image/png",
    });
    assert.equal(result.encounter.status, "pending");
    assert.equal(result.encounter.name, "Sarah Kim");
    assert.equal(result.encounter.event_name, "OpenAI DevDay");
  });

  it("rejects extract after session ended", async () => {
    const session = await startSession("Done Event");
    await endSession(session.id);
    await assert.rejects(
      () =>
        extractCapture({
          sessionId: session.id,
          imageBase64: "fake",
          mimeType: "image/png",
        }),
      /ended/,
    );
  });

  it("ends session and returns pending queue", async () => {
    const session = await startSession("Hackathon");
    await extractCapture({
      sessionId: session.id,
      imageBase64: "fake",
      mimeType: "image/png",
    });
    const ended = await endSession(session.id);
    assert.equal(ended.queue.length, 1);
    assert.ok(store.getSession(session.id)?.ended_at);
  });

  it("keeps encounter and makes it searchable", async () => {
    const session = await startSession("Healthcare Meetup");
    const { encounter } = await extractCapture({
      sessionId: session.id,
      imageBase64: "fake",
      mimeType: "image/png",
    });
    await triageEncounter(encounter.id, "keep", {
      context: "Talked about patient onboarding",
    });
    const results = await searchEncounters("healthcare");
    assert.equal(results.matches.length, 1);
    assert.equal(results.matches[0]?.id, encounter.id);
  });

  it("forgets encounter and excludes from search", async () => {
    const session = await startSession("Skip Event");
    const { encounter } = await extractCapture({
      sessionId: session.id,
      imageBase64: "fake",
      mimeType: "image/png",
    });
    await triageEncounter(encounter.id, "forget", {});
    const results = await searchEncounters("Sarah");
    assert.equal(results.matches.length, 0);
  });

  it("updates encounter fields before triage", async () => {
    setTestStubAIService(
      new StubAIService({
        name: null,
        number: null,
        location: null,
        context: null,
        company: null,
        role: null,
        linkedin_url: null,
        is_draft: true,
        confidence: 0.2,
      }),
    );
    const session = await startSession("Draft Event");
    const { encounter } = await extractCapture({
      sessionId: session.id,
      imageBase64: "fake",
      mimeType: "image/png",
    });
    assert.equal(encounter.is_draft, true);
    const updated = await updateEncounter(encounter.id, {
      name: "Alex Rivera",
      number: "555-0100",
      location: "SF",
    });
    assert.equal(updated.name, "Alex Rivera");
    assert.equal(updated.number, "555-0100");
    assert.equal(updated.location, "SF");
  });

  it("returns remaining queue after partial triage", async () => {
    const session = await startSession("Partial Triage");
    await extractCapture({
      sessionId: session.id,
      imageBase64: "fake-a",
      mimeType: "image/png",
    });
    await extractCapture({
      sessionId: session.id,
      imageBase64: "fake-b",
      mimeType: "image/png",
    });
    await extractCapture({
      sessionId: session.id,
      imageBase64: "fake-c",
      mimeType: "image/png",
    });

    const { queue: initial } = await getSessionQueue(session.id);
    assert.equal(initial.length, 3);

    await triageEncounter(initial[0]!.id, "forget", {});

    const { queue: remaining } = await getSessionQueue(session.id);
    assert.equal(remaining.length, 2);
    assert.deepEqual(
      remaining.map((e) => e.id),
      initial.slice(1).map((e) => e.id),
    );

    const { sessions } = await listPendingSessions();
    const pending = sessions.find(
      (entry): entry is NonNullable<(typeof sessions)[number]> =>
        entry != null && entry.session_id === session.id,
    );
    assert.ok(pending);
    assert.equal(pending.pending_count, 2);
  });
});
