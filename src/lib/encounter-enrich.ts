import type { Encounter } from "@relationship-memory/shared";

import type { InMemoryStore } from "./store";

export type EncounterWithCapture = Encounter & {
  capture_url: string | null;
};

export function enrichEncounter(
  store: InMemoryStore,
  encounter: Encounter,
): EncounterWithCapture {
  const capture = encounter.capture_id
    ? store.captures.get(encounter.capture_id)
    : null;
  return {
    ...encounter,
    capture_url: capture?.image_data_url ?? capture?.public_url ?? null,
  };
}

export function enrichEncounters(
  store: InMemoryStore,
  encounters: Encounter[],
): EncounterWithCapture[] {
  return encounters.map((e) => enrichEncounter(store, e));
}
