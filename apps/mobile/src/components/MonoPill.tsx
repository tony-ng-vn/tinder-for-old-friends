import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../theme";

export function MonoPill({ children }: { children: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(18, 26, 36, 0.6)",
  },
  text: {
    color: theme.textMono,
    fontSize: 11,
    fontFamily: theme.fonts.mono,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
