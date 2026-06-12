export const theme = {
  bgTop: "#0B1020",
  bgBottom: "#0F1F1A",
  panelBg: "rgba(18, 26, 36, 0.88)",
  glassBg: "rgba(255,255,255,0.08)",
  glassBorder: "rgba(131, 181, 181, 0.22)",
  text: "#F1F5F9",
  textMuted: "#94A3B8",
  textMono: "#83B5B5",
  keep: "#2DD4BF",
  keepGlow: "rgba(45, 212, 191, 0.45)",
  keepText: "#042F2E",
  forget: "#64748B",
  draft: "#C29E3F",
  draftText: "#1A1208",
  pixelReed: "#2D4D4A",
  pixelLily: "#526867",
  pixelFish: "#34D399",
  radiusLg: 24,
  radiusMd: 16,
  fonts: {
    pixel: "PressStart2P_400Regular",
    mono: "JetBrainsMono_500Medium",
    body: "System",
  },
} as const;

export type PondVariant = "home" | "monitoring" | "triage" | "memory" | "search";
