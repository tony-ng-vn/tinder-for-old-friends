import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

import { theme, type PondVariant } from "../theme";
import { PixelPondBackground } from "./PixelPondBackground";

export function ScreenShell({
  children,
  variant = "home",
}: {
  children: React.ReactNode;
  variant?: PondVariant;
}) {
  return (
    <View style={styles.root}>
      <LinearGradient colors={[theme.bgTop, theme.bgBottom]} style={StyleSheet.absoluteFill} />
      <PixelPondBackground variant={variant} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});
