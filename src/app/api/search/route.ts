import { SearchRequestSchema } from "@relationship-memory/shared";
import { NextRequest, NextResponse } from "next/server";

import { searchEncounters } from "@/lib/services";

export async function POST(req: NextRequest) {
  try {
    const body = SearchRequestSchema.parse(await req.json());
    const result = await searchEncounters(body.query, body.limit ?? 10);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
