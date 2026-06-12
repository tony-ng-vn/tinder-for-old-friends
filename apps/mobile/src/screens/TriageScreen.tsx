import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { api, type Encounter } from "../api";
import { SwipeDeck } from "../components/SwipeDeck";
import { useSession } from "../context/SessionContext";
import { cancelTriageNudge } from "../notifications/triageNudge";
import { theme } from "../theme";

export function TriageScreen() {
  const { sessionId, triageQueue, setTriageQueue } = useSession();
  const [loading, setLoading] = useState(true);
  const [verifiedEmpty, setVerifiedEmpty] = useState(false);

  const syncQueueFromApi = useCallback(async () => {
    if (!sessionId) {
      setVerifiedEmpty(true);
      return [];
    }

    const { queue } = await api.getSessionQueue(sessionId);
    setTriageQueue(queue);
    setVerifiedEmpty(queue.length === 0);
    if (queue.length === 0) {
      cancelTriageNudge();
    }
    return queue;
  }, [sessionId, setTriageQueue]);

  const verifyQueueEmpty = useCallback(async () => {
    setLoading(true);
    try {
      await syncQueueFromApi();
    } finally {
      setLoading(false);
    }
  }, [syncQueueFromApi]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setVerifiedEmpty(false);

      syncQueueFromApi()
        .catch(() => {
          if (active) setVerifiedEmpty(false);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, [syncQueueFromApi]),
  );

  const handleKeep = async (
    encounter: Encounter,
    fields?: { context?: string; name?: string; number?: string; location?: string },
  ) => {
    await api.triage(encounter.id, { action: "keep", ...fields });
    setTriageQueue((q) => {
      const next = q.filter((e) => e.id !== encounter.id);
      if (next.length === 0) {
        void verifyQueueEmpty();
      }
      return next;
    });
  };

  const handleForget = async (encounter: Encounter) => {
    await api.triage(encounter.id, { action: "forget" });
    setTriageQueue((q) => {
      const next = q.filter((e) => e.id !== encounter.id);
      if (next.length === 0) {
        void verifyQueueEmpty();
      }
      return next;
    });
  };

  if (loading || triageQueue.length === 0) {
    if (!loading && verifiedEmpty) {
      return (
        <View style={styles.center}>
          <Text style={styles.emptyPixel}>All caught up</Text>
          <Text style={styles.emptyText}>The pond is still again.</Text>
        </View>
      );
    }

    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.keep} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SwipeDeck
        key={sessionId ?? "triage"}
        queue={triageQueue}
        onKeep={handleKeep}
        onForget={handleForget}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  emptyPixel: {
    color: theme.text,
    fontFamily: theme.fonts.pixel,
    fontSize: 12,
    textAlign: "center",
  },
  emptyText: { color: theme.textMuted, fontSize: 15 },
});
