import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { NextRequest } from "next/server";

import { StubAIService, setTestStubAIService } from "@/lib/ai";
import { InMemoryStore, useInMemoryStore } from "@/lib/store";

import { GET as getEncounters } from "./encounters/route";
import { POST as triageEncounter } from "./encounters/[id]/triage/route";
import { POST as extractCapture } from "./extract/route";
import { POST as searchEncounters } from "./search/route";
import { POST as startSession } from "./sessions/route";
import { POST as endSession } from "./sessions/[id]/end/route";

const BASE = "http://localhost/api";

function jsonRequest(
  path: string,
  body: unknown,
  method: "POST" | "GET" = "POST",
): NextRequest {
  return new NextRequest(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: method === "POST" ? JSON.stringify(body) : undefined,
  });
}

function getRequest(path: string): NextRequest {
  return new NextRequest(`${BASE}${path}`, { method: "GET" });
}

async function readJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

describe("relationship memory API routes", () => {
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

  it("POST /api/sessions starts session with event_name and null ended_at", async () => {
    const res = await startSession(
      jsonRequest("/sessions", { event_name: "Vercel Ship Week" }),
    );
    assert.equal(res.status, 200);
    const body = await readJson<{ session: { event_name: string; ended_at: null } }>(
      res,
    );
    assert.equal(body.session.event_name, "Vercel Ship Week");
    assert.equal(body.session.ended_at, null);
  });

  it("POST /api/extract creates pending encounter during active session", async () => {
    const sessionRes = await startSession(
      jsonRequest("/sessions", { event_name: "OpenAI DevDay" }),
    );
    const { session } = await readJson<{ session: { id: string } }>(sessionRes);

    const res = await extractCapture(
      jsonRequest("/extract", {
        session_id: session.id,
        image_base64: "fake",
        mime_type: "image/png",
      }),
    );
    assert.equal(res.status, 200);
    const body = await readJson<{
      encounter: { status: string; name: string; event_name: string };
    }>(res);
    assert.equal(body.encounter.status, "pending");
    assert.equal(body.encounter.name, "Sarah Kim");
    assert.equal(body.encounter.event_name, "OpenAI DevDay");
  });

  it("POST /api/extract returns 400 after session ended", async () => {
    const sessionRes = await startSession(
      jsonRequest("/sessions", { event_name: "Done Event" }),
    );
    const { session } = await readJson<{ session: { id: string } }>(sessionRes);
    await endSession(getRequest(`/sessions/${session.id}/end`), {
      params: Promise.resolve({ id: session.id }),
    });

    const res = await extractCapture(
      jsonRequest("/extract", {
        session_id: session.id,
        image_base64: "fake",
        mime_type: "image/png",
      }),
    );
    assert.equal(res.status, 400);
    const body = await readJson<{ error: string }>(res);
    assert.match(body.error, /ended/);
  });

  it("POST /api/sessions/:id/end returns pending queue", async () => {
    const sessionRes = await startSession(
      jsonRequest("/sessions", { event_name: "Hackathon" }),
    );
    const { session } = await readJson<{ session: { id: string } }>(sessionRes);
    await extractCapture(
      jsonRequest("/extract", {
        session_id: session.id,
        image_base64: "fake",
        mime_type: "image/png",
      }),
    );

    const res = await endSession(getRequest(`/sessions/${session.id}/end`), {
      params: Promise.resolve({ id: session.id }),
    });
    assert.equal(res.status, 200);
    const body = await readJson<{ queue: unknown[] }>(res);
    assert.equal(body.queue.length, 1);
    assert.ok(store.getSession(session.id)?.ended_at);
  });

  it("POST /api/encounters/:id/triage keep makes encounter searchable", async () => {
    const sessionRes = await startSession(
      jsonRequest("/sessions", { event_name: "Healthcare Meetup" }),
    );
    const { session } = await readJson<{ session: { id: string } }>(sessionRes);
    const extractRes = await extractCapture(
      jsonRequest("/extract", {
        session_id: session.id,
        image_base64: "fake",
        mime_type: "image/png",
      }),
    );
    const { encounter } = await readJson<{ encounter: { id: string } }>(extractRes);

    const triageRes = await triageEncounter(
      jsonRequest("/encounters/x/triage", {
        action: "keep",
        context: "Talked about patient onboarding",
      }),
      { params: Promise.resolve({ id: encounter.id }) },
    );
    assert.equal(triageRes.status, 200);

    const searchRes = await searchEncounters(
      jsonRequest("/search", { query: "healthcare" }),
    );
    assert.equal(searchRes.status, 200);
    const searchBody = await readJson<{ matches: { id: string }[] }>(searchRes);
    assert.equal(searchBody.matches.length, 1);
    assert.equal(searchBody.matches[0]?.id, encounter.id);
  });

  it("POST /api/encounters/:id/triage forget excludes from search", async () => {
    const sessionRes = await startSession(
      jsonRequest("/sessions", { event_name: "Skip Event" }),
    );
    const { session } = await readJson<{ session: { id: string } }>(sessionRes);
    const extractRes = await extractCapture(
      jsonRequest("/extract", {
        session_id: session.id,
        image_base64: "fake",
        mime_type: "image/png",
      }),
    );
    const { encounter } = await readJson<{ encounter: { id: string } }>(extractRes);

    await triageEncounter(
      jsonRequest("/encounters/x/triage", { action: "forget" }),
      { params: Promise.resolve({ id: encounter.id }) },
    );

    const searchRes = await searchEncounters(
      jsonRequest("/search", { query: "Sarah" }),
    );
    const searchBody = await readJson<{ matches: unknown[] }>(searchRes);
    assert.equal(searchBody.matches.length, 0);
  });

  it("GET /api/encounters?status=kept returns kept encounters only", async () => {
    const sessionRes = await startSession(
      jsonRequest("/sessions", { event_name: "Filter Event" }),
    );
    const { session } = await readJson<{ session: { id: string } }>(sessionRes);

    const keptRes = await extractCapture(
      jsonRequest("/extract", {
        session_id: session.id,
        image_base64: "fake1",
        mime_type: "image/png",
      }),
    );
    const { encounter: kept } = await readJson<{ encounter: { id: string } }>(
      keptRes,
    );
    await triageEncounter(
      jsonRequest("/encounters/x/triage", { action: "keep" }),
      { params: Promise.resolve({ id: kept.id }) },
    );

    const forgottenRes = await extractCapture(
      jsonRequest("/extract", {
        session_id: session.id,
        image_base64: "fake2",
        mime_type: "image/png",
      }),
    );
    const { encounter: forgotten } = await readJson<{ encounter: { id: string } }>(
      forgottenRes,
    );
    await triageEncounter(
      jsonRequest("/encounters/x/triage", { action: "forget" }),
      { params: Promise.resolve({ id: forgotten.id }) },
    );

    const res = await getEncounters(getRequest("/encounters?status=kept"));
    assert.equal(res.status, 200);
    const body = await readJson<{ encounters: { id: string; status: string }[] }>(
      res,
    );
    assert.equal(body.encounters.length, 1);
    assert.equal(body.encounters[0]?.id, kept.id);
    assert.equal(body.encounters[0]?.status, "kept");
  });

  it("full core loop: start → extract → end → keep → search finds; forget excludes", async () => {
    const sessionRes = await startSession(
      jsonRequest("/sessions", { event_name: "Healthcare Meetup" }),
    );
    assert.equal(sessionRes.status, 200);
    const { session } = await readJson<{ session: { id: string } }>(sessionRes);

    const extractRes = await extractCapture(
      jsonRequest("/extract", {
        session_id: session.id,
        image_base64: "fake",
        mime_type: "image/png",
      }),
    );
    assert.equal(extractRes.status, 200);
    const { encounter } = await readJson<{ encounter: { id: string; status: string } }>(
      extractRes,
    );
    assert.equal(encounter.status, "pending");

    const endRes = await endSession(getRequest(`/sessions/${session.id}/end`), {
      params: Promise.resolve({ id: session.id }),
    });
    assert.equal(endRes.status, 200);
    const endBody = await readJson<{ queue: { id: string }[] }>(endRes);
    assert.equal(endBody.queue.length, 1);
    assert.equal(endBody.queue[0]?.id, encounter.id);

    const keepRes = await triageEncounter(
      jsonRequest("/encounters/x/triage", {
        action: "keep",
        context: "Talked about patient onboarding",
      }),
      { params: Promise.resolve({ id: encounter.id }) },
    );
    assert.equal(keepRes.status, 200);

    const searchRes = await searchEncounters(
      jsonRequest("/search", { query: "healthcare" }),
    );
    assert.equal(searchRes.status, 200);
    const searchBody = await readJson<{ matches: { id: string }[] }>(searchRes);
    assert.equal(searchBody.matches.length, 1);
    assert.equal(searchBody.matches[0]?.id, encounter.id);

    const forgetRes = await triageEncounter(
      jsonRequest("/encounters/x/triage", { action: "forget" }),
      { params: Promise.resolve({ id: encounter.id }) },
    );
    assert.equal(forgetRes.status, 200);

    const searchAfterForget = await searchEncounters(
      jsonRequest("/search", { query: "healthcare" }),
    );
    const afterForgetBody = await readJson<{ matches: unknown[] }>(
      searchAfterForget,
    );
    assert.equal(afterForgetBody.matches.length, 0);
  });
});
