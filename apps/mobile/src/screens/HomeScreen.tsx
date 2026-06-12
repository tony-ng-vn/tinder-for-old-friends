import { MOBILE_ROUTES } from "@relationship-memory/shared";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { api, type PendingSession } from "../api";
import { GlassCard } from "../components/GlassCard";
import { GlowButton } from "../components/GlowButton";
import { MonoPill } from "../components/MonoPill";
import { useSession } from "../context/SessionContext";
import { theme } from "../theme";

const STEPS = [
  { n: "01", label: "Capture", hint: "screenshot → encounter" },
  { n: "02", label: "Triage", hint: "keep or let drift" },
  { n: "03", label: "Recall", hint: "search your memory" },
];

type HomeMode = "choose" | "new";

export function HomeScreen({ navigation }: { navigation: any }) {
  const [mode, setMode] = useState<HomeMode>("choose");
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<PendingSession[]>([]);
  const { setSession, setTriageQueue, setPendingSessions } = useSession();

  const loadPending = useCallback(async () => {
    try {
      const { sessions } = await api.listPendingSessions();
      setPending(sessions);
      setPendingSessions(sessions);
    } catch {
      setPending([]);
    }
  }, [setPendingSessions]);

  useFocusEffect(
    useCallback(() => {
      loadPending();
      setMode("choose");
    }, [loadPending]),
  );

  const startNew = async () => {
    if (!eventName.trim()) return;
    setLoading(true);
    try {
      const { session } = await api.startSession(eventName.trim());
      setSession(session.id, session.event_name);
      navigation.navigate(MOBILE_ROUTES.Monitoring);
    } finally {
      setLoading(false);
    }
  };

  const resumeSession = async (session: PendingSession) => {
    setLoading(true);
    try {
      setTriageQueue([]);
      const { queue } = await api.getSessionQueue(session.session_id);
      setSession(session.session_id, session.event_name);
      setTriageQueue(queue);
      navigation.navigate(MOBILE_ROUTES.Triage);
    } finally {
      setLoading(false);
    }
  };

  if (mode === "new") {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setMode("choose")}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Start new session</Text>
        <Text style={styles.sectionSub}>Name the event you're at right now.</Text>

        <GlassCard style={styles.card}>
          <Text style={styles.label}>Event name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Ship Week Demo Day"
            placeholderTextColor={theme.textMuted}
            value={eventName}
            onChangeText={setEventName}
          />
          <GlowButton
            label={loading ? "Starting…" : "Start monitoring →"}
            onPress={startNew}
            disabled={loading || !eventName.trim()}
          />
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MonoPill>Swipe through people you almost forgot</MonoPill>

      <Text style={styles.title}>Tinder for{"\n"}Old Friends</Text>
      <Text style={styles.sub}>
        You ran into someone from way back.{"\n"}One screenshot. One swipe.{"\n"}Keep the ones worth reconnecting with.
      </Text>

      <View style={styles.formula}>
        {STEPS.map((step) => (
          <View key={step.n} style={styles.step}>
            <Text style={styles.stepN}>{step.n}</Text>
            <View>
              <Text style={styles.stepLabel}>{step.label}</Text>
              <Text style={styles.stepHint}>{step.hint}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.choiceHeading}>What would you like to do?</Text>

      {pending.length > 0 && (
        <View style={styles.choiceBlock}>
          <Text style={styles.choiceLabel}>Resume unfinished session</Text>
          {pending.map((session) => (
            <TouchableOpacity
              key={session.session_id}
              style={styles.resumeCard}
              onPress={() => resumeSession(session)}
              disabled={loading}
            >
              <GlassCard>
                <MonoPill>{`Triage · ${session.event_name}`}</MonoPill>
                <Text style={styles.resumeCount}>
                  {`${session.pending_count} ${session.pending_count === 1 ? "person" : "people"} waiting`}
                </Text>
                <Text style={styles.resumeCta}>Resume triage →</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.choiceBlock}>
        <Text style={styles.choiceLabel}>Start new session</Text>
        <TouchableOpacity onPress={() => setMode("new")}>
          <GlassCard style={styles.newCard}>
            <Text style={styles.newTitle}>New event</Text>
            <Text style={styles.newHint}>Capture screenshots and triage later</Text>
            <Text style={styles.newCta}>Create session →</Text>
          </GlassCard>
        </TouchableOpacity>
      </View>

      <View style={styles.nav}>
        <TouchableOpacity onPress={() => navigation.navigate(MOBILE_ROUTES.Memory)}>
          <Text style={styles.link}>Memory</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(MOBILE_ROUTES.Search)}>
          <Text style={styles.link}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: {
    color: theme.text,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: theme.fonts.pixel,
    marginTop: 16,
  },
  sub: {
    color: theme.textMuted,
    marginTop: 16,
    marginBottom: 20,
    lineHeight: 22,
    fontSize: 15,
  },
  formula: { marginBottom: 20, gap: 10 },
  step: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  stepN: {
    color: theme.keep,
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    width: 24,
  },
  stepLabel: { color: theme.text, fontSize: 14, fontWeight: "600" },
  stepHint: {
    color: theme.textMono,
    fontSize: 12,
    fontFamily: theme.fonts.mono,
    marginTop: 2,
  },
  choiceHeading: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  choiceBlock: { marginBottom: 16, gap: 8 },
  choiceLabel: {
    color: theme.textMono,
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  resumeCard: { marginBottom: 8 },
  resumeCount: { color: theme.textMuted, fontSize: 14, marginTop: 8 },
  resumeCta: { color: theme.keep, fontSize: 15, fontWeight: "600", marginTop: 8 },
  newCard: { gap: 4 },
  newTitle: { color: theme.text, fontSize: 18, fontWeight: "600" },
  newHint: { color: theme.textMuted, fontSize: 14 },
  newCta: { color: theme.keep, fontSize: 15, fontWeight: "600", marginTop: 8 },
  card: { marginBottom: 16 },
  label: {
    color: theme.textMuted,
    marginBottom: 8,
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: theme.radiusMd,
    padding: 14,
    color: theme.text,
    marginBottom: 16,
    fontSize: 16,
  },
  sectionTitle: {
    color: theme.text,
    fontSize: 22,
    fontWeight: "600",
    marginTop: 8,
  },
  sectionSub: { color: theme.textMuted, fontSize: 15, marginTop: 8, marginBottom: 20 },
  back: { color: theme.textMono, fontFamily: theme.fonts.mono, fontSize: 14, marginBottom: 8 },
  nav: { flexDirection: "row", justifyContent: "space-around", marginTop: 24 },
  link: { color: theme.textMono, fontSize: 15, fontFamily: theme.fonts.mono },
});
