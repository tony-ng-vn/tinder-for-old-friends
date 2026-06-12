import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { encounterImageUri, type Encounter } from "../api";
import { theme } from "../theme";

const { width } = Dimensions.get("window");
const GAP = 12;
const COLS = 2;
const CARD_WIDTH = (width - 32 - GAP) / COLS;

type Props = {
  encounter: Encounter;
  onPress?: () => void;
  subtitle?: string;
};

export function EncounterGalleryCard({ encounter, onPress, subtitle }: Props) {
  const uri = encounterImageUri(encounter);
  const label = encounter.name ?? (encounter.is_draft ? "Draft" : "Unknown");
  const meta = [encounter.company, encounter.location].filter(Boolean).join(" · ");

  const content = (
    <View style={styles.card}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>?</Text>
        </View>
      )}
      <View style={styles.overlay}>
        <Text style={styles.name} numberOfLines={1}>
          {label}
        </Text>
        {meta ? (
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.wrap}>{content}</View>;
}

const styles = StyleSheet.create({
  wrap: {
    width: CARD_WIDTH,
    marginBottom: GAP,
  },
  card: {
    borderRadius: theme.radiusMd,
    overflow: "hidden",
    backgroundColor: theme.panelBg,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 4,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.glassBg,
  },
  placeholderText: {
    color: theme.textMuted,
    fontSize: 32,
    fontWeight: "600",
  },
  overlay: {
    padding: 10,
    gap: 2,
  },
  name: {
    color: theme.text,
    fontSize: 15,
    fontWeight: "600",
  },
  meta: {
    color: theme.textMuted,
    fontSize: 12,
  },
  subtitle: {
    color: theme.textMono,
    fontSize: 11,
    fontFamily: theme.fonts.mono,
    marginTop: 4,
  },
});

export const galleryColumnWrapper = { gap: GAP, paddingHorizontal: 16 };

export function galleryItemSpacing(index: number) {
  return { marginRight: index % COLS === 0 ? GAP : 0 };
}
