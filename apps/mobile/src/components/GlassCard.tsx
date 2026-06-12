import { BlurView } from "expo-blur";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { theme } from "../theme";

export function GlassCard({
  children,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.wrap, style]}>
      <BlurView intensity={40} tint="dark" style={[styles.blur, contentStyle]}>
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: theme.radiusLg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  blur: {
    backgroundColor: theme.panelBg,
    padding: 20,
  },
});
