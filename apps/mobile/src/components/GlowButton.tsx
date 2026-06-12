import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
} from "react-native";

import { theme } from "../theme";

export function GlowButton({
  label,
  variant = "primary",
  ...props
}: PressableProps & { label: string; variant?: "primary" | "outline" }) {
  const primary = variant === "primary";

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.wrap,
        primary ? styles.primary : styles.outline,
        pressed && styles.pressed,
        props.disabled && styles.disabled,
      ]}
    >
      {primary && <View style={styles.glow} />}
      <Text style={[styles.label, primary ? styles.labelPrimary : styles.labelOutline]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: theme.radiusMd,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    overflow: "visible",
  },
  primary: {
    backgroundColor: theme.keep,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  glow: {
    position: "absolute",
    left: -4,
    right: -4,
    top: -4,
    bottom: -4,
    borderRadius: theme.radiusMd + 4,
    backgroundColor: theme.keepGlow,
    opacity: 0.55,
    zIndex: -1,
  },
  label: { fontSize: 16, fontWeight: "600" },
  labelPrimary: { color: theme.keepText },
  labelOutline: { color: theme.textMuted },
  pressed: { opacity: 0.88 },
  disabled: { opacity: 0.5 },
});
