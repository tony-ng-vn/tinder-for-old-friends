import { MOBILE_ROUTES } from "@relationship-memory/shared";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { api } from "../api";
import { GlassCard } from "../components/GlassCard";
import { GlowButton } from "../components/GlowButton";
import { MonoPill } from "../components/MonoPill";
import { useSession } from "../context/SessionContext";
import { scheduleTriageNudge } from "../notifications/triageNudge";
import { theme } from "../theme";

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

function formatActivityLabel(item: {
  name: string | null;
  isDraft: boolean;
  extractionSource?: "stub" | "cursor";
}): string {
  if (item.isDraft) {
    return item.extractionSource === "stub"
      ? "Demo draft · screenshot saved"
      : "Draft · (add name) · screenshot saved";
  }
  if (item.extractionSource === "stub") {
    return item.name ? `Demo: ${item.name}` : "Demo · screenshot saved";
  }
  return item.name ?? "Unknown";
}

export function MonitoringScreen({ navigation }: { navigation: any }) {
  const { sessionId, eventName, setTriageQueue, activityFeed, addActivity } = useSession();
  const [importing, setImporting] = useState(false);
  const [importCount, setImportCount] = useState(0);
  const [demoMode, setDemoMode] = useState<boolean | null>(null);

  const importPhotos = async () => {
    if (!sessionId) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });
    if (result.canceled || !result.assets.length) return;

    setImporting(true);
    let success = 0;
    const failures: string[] = [];
    try {
      for (const [i, asset] of result.assets.entries()) {
        if (!asset.base64) {
          failures.push(`Photo ${i + 1}: missing image data`);
          continue;
        }
        const mime =
          asset.mimeType === "image/png"
            ? "image/png"
            : asset.mimeType === "image/gif"
              ? "image/gif"
              : asset.mimeType === "image/webp"
                ? "image/webp"
                : "image/jpeg";
        try {
          const { encounter, extraction_source } = await api.extract({
            session_id: sessionId,
            image_base64: asset.base64,
            mime_type: mime,
          });
          setDemoMode(extraction_source === "stub");
          addActivity({
            id: encounter.id,
            name: encounter.name,
            isDraft: encounter.is_draft,
            at: new Date().toISOString(),
            extractionSource: extraction_source,
          });
          success += 1;
        } catch (e) {
          failures.push(
            `Photo ${i + 1}: ${e instanceof Error ? e.message : "import failed"}`,
          );
        }
      }
      setImportCount((c) => c + success);
      if (success > 0) {
        Alert.alert(
          "Captured",
          failures.length
            ? `${success} of ${result.assets.length} imported. ${failures[0]}`
            : success === 1
              ? "Another lily pad on the pond."
              : `${success} lily pads on the pond.`,
        );
      } else if (failures.length) {
        Alert.alert("Import failed", failures.join("\n"));
      }
    } finally {
      setImporting(false);
    }
  };

  const endMonitoring = async () => {
    if (!sessionId) return;
    const { queue } = await api.endSession(sessionId);
    setTriageQueue(queue);
    if (queue.length > 0) {
      await scheduleTriageNudge(queue.length);
    }
    navigation.navigate(MOBILE_ROUTES.Triage);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MonoPill>{`Monitoring · ${eventName}`}</MonoPill>

      <GlassCard style={styles.banner}>
        <Text style={styles.hint}>
          Screenshot LinkedIn profiles during the event, then import from Photos.
          Select multiple screenshots at once — each becomes someone on the pond.
        </Text>
        {demoMode !== false && (
          <Text style={styles.demoNote}>
            Demo mode is on: names shown are sample placeholders, not read from your
            screenshots. Enable real AI extraction to pull names from LinkedIn images.
          </Text>
        )}
        {importCount > 0 && (
          <Text style={styles.count}>{`${importCount} captured this session`}</Text>
        )}
      </GlassCard>

      <GlowButton
        label={importing ? "Importing…" : "Import from Photos"}
        onPress={importPhotos}
        disabled={importing}
      />

      {activityFeed.length > 0 && (
        <View style={styles.feedSection}>
          <MonoPill>Recent extractions</MonoPill>
          <GlassCard style={styles.feed}>
            {activityFeed.map((item) => (
              <View key={item.id} style={styles.feedRow}>
                <Text style={styles.feedTime}>{formatRelative(item.at)}</Text>
                <Text style={styles.feedBody}>{formatActivityLabel(item)}</Text>
              </View>
            ))}
          </GlassCard>
        </View>
      )}

      <TouchableOpacity
        style={[styles.endBtn, importing && styles.endBtnDisabled]}
        onPress={endMonitoring}
        disabled={importing}
      >
        <Text style={styles.endText}>
          {importing ? "Wait for imports to finish…" : "End monitoring"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 16, paddingBottom: 40 },
  banner: { marginTop: 8 },
  hint: { color: theme.textMuted, lineHeight: 22, fontSize: 15 },
  demoNote: {
    color: theme.textMono,
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
  count: {
    color: theme.textMono,
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    marginTop: 12,
    textTransform: "uppercase",
  },
  feedSection: { gap: 10, marginTop: 8 },
  feed: { gap: 12 },
  feedRow: { gap: 4 },
  feedTime: {
    color: theme.textMono,
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  feedBody: { color: theme.text, fontSize: 15, lineHeight: 20 },
  endBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: theme.radiusMd,
    padding: 16,
    alignItems: "center",
  },
  endBtnDisabled: { opacity: 0.45 },
  endText: { color: theme.textMuted, fontWeight: "600", fontSize: 16 },
});
