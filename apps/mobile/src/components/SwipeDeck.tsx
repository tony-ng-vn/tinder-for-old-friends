import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { encounterImageUri, type Encounter } from "../api";
import { theme } from "../theme";
import { GlassCard } from "./GlassCard";
import { MonoPill } from "./MonoPill";

const { width, height } = Dimensions.get("window");
const THRESHOLD = width * 0.28;
const CARD_HEIGHT = Math.min(height * 0.62, 520);

type Props = {
  queue: Encounter[];
  onKeep: (
    encounter: Encounter,
    fields?: { context?: string; name?: string; number?: string; location?: string },
  ) => void;
  onForget: (encounter: Encounter) => void;
};

export function SwipeDeck({ queue, onKeep, onForget }: Props) {
  const [index, setIndex] = useState(0);
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [pendingKeep, setPendingKeep] = useState<Encounter | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftNumber, setDraftNumber] = useState("");
  const [draftLocation, setDraftLocation] = useState("");
  const position = useRef(new Animated.ValueXY()).current;
  const currentRef = useRef<Encounter | undefined>(undefined);

  const current = queue[index];
  currentRef.current = current;

  useEffect(() => {
    if (pendingKeep) {
      setDraftName(pendingKeep.name ?? "");
      setDraftNumber(pendingKeep.number ?? "");
      setDraftLocation(pendingKeep.location ?? "");
    }
  }, [pendingKeep?.id]);

  const resetPosition = () => {
    position.setValue({ x: 0, y: 0 });
  };

  const advance = () => {
    resetPosition();
    setIndex((i) => i + 1);
    setContext("");
    setShowContext(false);
    setPendingKeep(null);
  };

  const commitKeep = (ctx?: string) => {
    if (!pendingKeep) return;
    onKeep(pendingKeep, {
      context: ctx,
      name: pendingKeep.is_draft ? draftName.trim() || undefined : undefined,
      number: pendingKeep.is_draft ? draftNumber.trim() || undefined : undefined,
      location: pendingKeep.is_draft ? draftLocation.trim() || undefined : undefined,
    });
    advance();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const commitForget = (encounter: Encounter) => {
    Animated.timing(position, {
      toValue: { x: -width * 0.6, y: 48 },
      duration: 280,
      useNativeDriver: false,
    }).start(() => {
      onForget(encounter);
      advance();
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => !showContext,
      onPanResponderMove: (_, g) => {
        position.setValue({ x: g.dx, y: g.dy * 0.15 });
      },
      onPanResponderRelease: (_, g) => {
        const enc = currentRef.current;
        if (!enc) return;

        if (g.dx > THRESHOLD) {
          Animated.timing(position, {
            toValue: { x: width * 1.2, y: 0 },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            setPendingKeep(enc);
            setShowContext(true);
            resetPosition();
          });
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (g.dx < -THRESHOLD) {
          commitForget(enc);
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            speed: 20,
          }).start();
        }
      },
    }),
  ).current;

  if (!current && !showContext) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyPixel}>All caught up</Text>
        <Text style={styles.emptyText}>The pond is still again.</Text>
      </View>
    );
  }

  const rotate = position.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-8deg", "0deg", "8deg"],
  });

  const keepOpacity = position.x.interpolate({
    inputRange: [0, THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const forgetOpacity = position.x.interpolate({
    inputRange: [-THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const stackBehind = queue.slice(index + 1, index + 3);

  return (
    <View style={styles.container}>
      <MonoPill>{`${queue.length - index} to review`}</MonoPill>

      <View style={styles.deck}>
        {stackBehind
          .slice()
          .reverse()
          .map((enc, i) => {
            const depth = stackBehind.length - i;
            const scale = depth === 2 ? 0.92 : 0.96;
            const uri = encounterImageUri(enc);
            return (
              <View
                key={enc.id}
                style={[
                  styles.card,
                  styles.cardBehind,
                  { transform: [{ scale }], zIndex: i },
                ]}
              >
                {uri ? (
                  <Image source={{ uri }} style={styles.photo} resizeMode="cover" />
                ) : (
                  <View style={[styles.photo, styles.photoPlaceholder]} />
                )}
              </View>
            );
          })}

        {current && !showContext && (
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              {
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate },
                ],
              },
            ]}
            {...panResponder.panHandlers}
            accessibilityLabel={`Review ${current.name ?? "unknown person"}. Swipe right to keep, left to forget.`}
          >
            {encounterImageUri(current) ? (
              <Image
                source={{ uri: encounterImageUri(current)! }}
                style={styles.photo}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.photo, styles.photoPlaceholder]}>
                <Text style={styles.photoPlaceholderText}>No photo</Text>
              </View>
            )}

            {current.is_draft && (
              <View style={styles.draftBadge}>
                <Text style={styles.draftText}>DRAFT</Text>
              </View>
            )}

            <Animated.View style={[styles.stamp, styles.keepStamp, { opacity: keepOpacity }]}>
              <Text style={styles.keepStampText}>KEEP</Text>
            </Animated.View>
            <Animated.View style={[styles.stamp, styles.forgetStamp, { opacity: forgetOpacity }]}>
              <Text style={styles.forgetStampText}>FORGET</Text>
            </Animated.View>
          </Animated.View>
        )}
      </View>

      {!showContext && current && (
        <Text style={styles.hint}>Swipe right to keep · left to forget</Text>
      )}

      {showContext && pendingKeep && (
        <GlassCard style={styles.sheet}>
          <Text style={styles.sheetTitle}>
            {pendingKeep.is_draft ? "Fill in details (optional)" : "Add context (optional)"}
          </Text>
          {pendingKeep.is_draft && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor={theme.textMuted}
                value={draftName}
                onChangeText={setDraftName}
              />
              <TextInput
                style={styles.input}
                placeholder="Number"
                placeholderTextColor={theme.textMuted}
                value={draftNumber}
                onChangeText={setDraftNumber}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor={theme.textMuted}
                value={draftLocation}
                onChangeText={setDraftLocation}
              />
            </>
          )}
          <TextInput
            style={styles.input}
            placeholder="What did you talk about?"
            placeholderTextColor={theme.textMuted}
            value={context}
            onChangeText={setContext}
            multiline
          />
          <View style={styles.row}>
            <Text style={styles.skip} onPress={() => commitKeep(undefined)}>
              Skip
            </Text>
            <Text style={styles.save} onPress={() => commitKeep(context || undefined)}>
              Done
            </Text>
          </View>
        </GlassCard>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  deck: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  card: {
    width: width - 48,
    height: CARD_HEIGHT,
    borderRadius: theme.radiusLg,
    overflow: "hidden",
    backgroundColor: theme.panelBg,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  cardFront: {
    position: "absolute",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  cardBehind: {
    position: "absolute",
    opacity: 0.7,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.glassBg,
  },
  photoPlaceholderText: {
    color: theme.textMuted,
    fontSize: 16,
  },
  draftBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: theme.draft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  draftText: {
    color: theme.draftText,
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  stamp: {
    position: "absolute",
    top: 40,
    borderWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  keepStamp: {
    left: 24,
    borderColor: theme.keep,
    transform: [{ rotate: "-12deg" }],
  },
  forgetStamp: {
    right: 24,
    borderColor: theme.forget,
    transform: [{ rotate: "12deg" }],
  },
  keepStampText: {
    color: theme.keep,
    fontFamily: theme.fonts.mono,
    fontSize: 22,
    fontWeight: "700",
  },
  forgetStampText: {
    color: theme.forget,
    fontFamily: theme.fonts.mono,
    fontSize: 22,
    fontWeight: "700",
  },
  hint: {
    color: theme.textMuted,
    fontSize: 13,
    fontFamily: theme.fonts.mono,
    marginBottom: 12,
    textAlign: "center",
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  emptyPixel: {
    color: theme.text,
    fontFamily: theme.fonts.pixel,
    fontSize: 12,
    textAlign: "center",
  },
  emptyText: { color: theme.textMuted, fontSize: 15 },
  sheet: { width: "100%", marginTop: 8, marginBottom: 16 },
  sheetTitle: { color: theme.text, marginBottom: 12, fontSize: 16, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: theme.radiusMd,
    padding: 12,
    color: theme.text,
    marginBottom: 10,
    fontSize: 16,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  skip: { color: theme.textMuted, fontSize: 16, padding: 8 },
  save: { color: theme.keep, fontSize: 16, fontWeight: "600", padding: 8 },
});
