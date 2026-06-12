import { ExtractRequestSchema } from "@relationship-memory/shared";
import { NextRequest, NextResponse } from "next/server";

import { extractCapture } from "@/lib/services";

export async function POST(req: NextRequest) {
  try {
    const body = ExtractRequestSchema.parse(await req.json());
    const result = await extractCapture({
      sessionId: body.session_id,
      imageBase64: body.image_base64,
      mimeType: body.mime_type,
      storagePath: body.storage_path,
      publicUrl: body.public_url,
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("not found")
      ? 404
      : message.includes("ended")
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
