import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { encounterImageUri, type Encounter } from "../api";
import { theme } from "../theme";
import { GlassCard } from "./GlassCard";

type DraftFields = {
  name: string;
  number: string;
  location: string;
  onNameChange: (v: string) => void;
  onNumberChange: (v: string) => void;
  onLocationChange: (v: string) => void;
};

type Props = {
  encounter: Encounter;
  style?: StyleProp<ViewStyle>;
  draft?: DraftFields;
};

export function EncounterCard({ encounter, style, draft }: Props) {
  const imageUrl = encounterImageUri(encounter);

  return (
    <GlassCard style={[styles.card, style]} contentStyle={styles.cardInner}>
      {imageUrl ? (
        <View style={styles.imageWrap}>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        </View>
      ) : (
        <View style={[styles.imageWrap, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>No capture preview</Text>
        </View>
      )}

      <View style={styles.facts}>
        {encounter.is_draft && (
          <Text style={styles.draft}>DRAFT · fill in details</Text>
        )}

        {draft ? (
          <>
            <TextInput
              style={styles.draftInput}
              placeholder="Name"
              placeholderTextColor={theme.textMuted}
              value={draft.name}
              onChangeText={draft.onNameChange}
            />
            <TextInput
              style={styles.draftInput}
              placeholder="Number"
              placeholderTextColor={theme.textMuted}
              value={draft.number}
              onChangeText={draft.onNumberChange}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.draftInput}
              placeholder="Location"
              placeholderTextColor={theme.textMuted}
              value={draft.location}
              onChangeText={draft.onLocationChange}
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{encounter.name ?? "Unknown"}</Text>
            {(encounter.role || encounter.company) && (
              <Text style={styles.sub}>
                {[encounter.role, encounter.company].filter(Boolean).join(" @ ")}
              </Text>
            )}
          </>
        )}

        {encounter.number ? (
          <Text style={styles.meta}>{encounter.number}</Text>
        ) : null}
        {encounter.location ? (
          <Text style={styles.meta}>{encounter.location}</Text>
        ) : null}
        <Text style={styles.event}>{encounter.event_name}</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, overflow: "hidden" },
  cardInner: { flex: 1, padding: 0 },
  imageWrap: { height: "60%", minHeight: 180, backgroundColor: theme.panelBg },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  placeholderText: { color: theme.textMuted, fontSize: 13 },
  facts: { flex: 1, padding: 16, gap: 4 },
  name: { color: theme.text, fontSize: 22, fontWeight: "600" },
  sub: { color: theme.textMuted, fontSize: 16, marginTop: 4 },
  meta: { color: theme.textMuted, fontSize: 14, marginTop: 2 },
  event: {
    color: theme.textMono,
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
    marginTop: 8,
    textTransform: "uppercase",
  },
  draft: {
    alignSelf: "flex-start",
    backgroundColor: theme.draft,
    color: theme.draftText,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  draftInput: {
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: theme.radiusMd,
    padding: 12,
    color: theme.text,
    marginBottom: 8,
    fontSize: 16,
  },
});
