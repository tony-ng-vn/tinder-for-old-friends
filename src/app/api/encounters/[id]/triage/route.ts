import { TriageRequestSchema } from "@relationship-memory/shared";
import { NextRequest, NextResponse } from "next/server";

import { triageEncounter } from "@/lib/services";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = TriageRequestSchema.parse(await req.json());
    const encounter = await triageEncounter(id, body.action, {
      context: body.context,
      name: body.name,
      number: body.number,
      location: body.location,
    });
    return NextResponse.json({ encounter });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: message.includes("not found") ? 404 : 500 },
    );
  }
}
