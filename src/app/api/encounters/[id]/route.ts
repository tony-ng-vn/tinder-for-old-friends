import { UpdateEncounterRequestSchema } from "@relationship-memory/shared";
import { NextRequest, NextResponse } from "next/server";

import { updateEncounter } from "@/lib/services";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = UpdateEncounterRequestSchema.parse(await req.json());
    const encounter = await updateEncounter(id, body);
    return NextResponse.json({ encounter });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: message.includes("not found") ? 404 : 500 },
    );
  }
}
