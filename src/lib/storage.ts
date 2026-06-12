import { captureStoragePath } from "@relationship-memory/shared";

import { createServiceClient } from "./supabase";

export async function uploadCaptureImage(input: {
  sessionId: string;
  captureId: string;
  imageBase64: string;
  mimeType: string;
}) {
  const supabase = createServiceClient();
  const ext = input.mimeType.split("/")[1] ?? "png";
  const storagePath = captureStoragePath(input.sessionId, input.captureId, ext);
  const bytes = Buffer.from(input.imageBase64, "base64");

  const { error } = await supabase.storage.from("captures").upload(storagePath, bytes, {
    contentType: input.mimeType,
    upsert: true,
  });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from("captures").getPublicUrl(storagePath);
  return { storagePath, publicUrl: data.publicUrl };
}
