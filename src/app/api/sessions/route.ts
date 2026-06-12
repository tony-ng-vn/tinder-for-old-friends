import { StartSessionRequestSchema } from "@relationship-memory/shared";
import { NextRequest, NextResponse } from "next/server";

import { listPendingSessions, startSession } from "@/lib/services";

export async function GET() {
  try {
    const result = await listPendingSessions();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = StartSessionRequestSchema.parse(await req.json());
    const session = await startSession(body.event_name);
    return NextResponse.json({ session });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
