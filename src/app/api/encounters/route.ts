import { NextRequest, NextResponse } from "next/server";

import { enrichEncounters } from "@/lib/encounter-enrich";
import { getStore } from "@/lib/store";
import { createServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status") ?? "kept";
    const mem = getStore();

    if (mem) {
      const encounters = [...mem.encounters.values()].filter((e) => e.status === status);
      return NextResponse.json({ encounters: enrichEncounters(mem, encounters) });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("encounters")
      .select("*, captures ( id, public_url, storage_path, mime_type )")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const encounters = (data ?? []).map((e) => {
      const capture = e.captures as { public_url: string | null } | null;
      return { ...e, capture_url: capture?.public_url ?? null };
    });
    return NextResponse.json({ encounters });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
