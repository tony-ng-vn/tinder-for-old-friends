const CURSOR_API_BASE = "https://api.cursor.com/v1";

type CursorImage = {
  data: string;
  mimeType: "image/png" | "image/jpeg" | "image/gif" | "image/webp";
};

type CreateAgentResponse = {
  agent: { id: string; latestRunId: string };
  run: { id: string; status: string };
};

type RunResponse = {
  id: string;
  status: string;
  result?: string;
};

function authHeader(): string {
  const key = process.env.CURSOR_API_KEY;
  if (!key) throw new Error("CURSOR_API_KEY is not set");
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

function modelId(): string {
  return process.env.CURSOR_MODEL_ID ?? "composer-2.5";
}

async function createNoRepoAgent(prompt: {
  text: string;
  images?: CursorImage[];
}): Promise<CreateAgentResponse> {
  const res = await fetch(`${CURSOR_API_BASE}/agents`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      model: { id: modelId() },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cursor create agent failed (${res.status}): ${body}`);
  }

  return res.json();
}

async function getRun(agentId: string, runId: string): Promise<RunResponse> {
  const res = await fetch(`${CURSOR_API_BASE}/agents/${agentId}/runs/${runId}`, {
    headers: { Authorization: authHeader() },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cursor get run failed (${res.status}): ${body}`);
  }

  return res.json();
}

const TERMINAL = new Set(["COMPLETED", "FAILED", "CANCELLED", "ERROR"]);

async function waitForRunResult(
  agentId: string,
  runId: string,
  { timeoutMs = 120_000, pollMs = 1500 } = {},
): Promise<string> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const run = await getRun(agentId, runId);

    if (TERMINAL.has(run.status)) {
      if (!run.result) {
        throw new Error(`Cursor run ${run.status} with no result`);
      }
      return run.result;
    }

    await new Promise((r) => setTimeout(r, pollMs));
  }

  throw new Error(`Cursor run timed out after ${timeoutMs}ms`);
}

export async function cursorPrompt(prompt: {
  text: string;
  images?: CursorImage[];
}): Promise<string> {
  const { agent, run } = await createNoRepoAgent(prompt);
  return waitForRunResult(agent.id, run.id);
}

export function parseJsonFromModel<T>(text: string): T {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(raw) as T;
}
