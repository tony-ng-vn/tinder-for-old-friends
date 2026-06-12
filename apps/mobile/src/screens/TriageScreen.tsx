import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { api, type Encounter } from "../api";
import { SwipeDeck } from "../components/SwipeDeck";
import { useSession } from "../context/SessionContext";
import { cancelTriageNudge } from "../notifications/triageNudge";

export function TriageScreen() {
  const { triageQueue, setTriageQueue } = useSession();

  useEffect(() => {
    if (triageQueue.length === 0) {
      cancelTriageNudge();
    }
  }, [triageQueue.length]);

  const handleKeep = async (
    encounter: Encounter,
    fields?: { context?: string; name?: string; number?: string; location?: string },
  ) => {
    cancelTriageNudge();
    await api.triage(encounter.id, { action: "keep", ...fields });
    setTriageQueue((q) => q.filter((e) => e.id !== encounter.id));
  };

  const handleForget = async (encounter: Encounter) => {
    cancelTriageNudge();
    await api.triage(encounter.id, { action: "forget" });
    setTriageQueue((q) => q.filter((e) => e.id !== encounter.id));
  };

  return (
    <View style={styles.container}>
      <SwipeDeck
        queue={triageQueue}
        onKeep={handleKeep}
        onForget={handleForget}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
