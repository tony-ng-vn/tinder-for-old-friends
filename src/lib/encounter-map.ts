type CaptureJoin = { public_url: string | null } | { public_url: string | null }[] | null;

export function captureUrlFromJoin(captures: CaptureJoin): string | null {
  if (!captures) return null;
  const row = Array.isArray(captures) ? captures[0] : captures;
  return row?.public_url ?? null;
}

export function mapEncounterWithCapture<T extends { captures?: CaptureJoin }>(
  encounter: T,
): Omit<T, "captures"> & { capture_url: string | null } {
  const { captures, ...rest } = encounter;
  return {
    ...rest,
    capture_url: captureUrlFromJoin(captures ?? null),
  };
}
