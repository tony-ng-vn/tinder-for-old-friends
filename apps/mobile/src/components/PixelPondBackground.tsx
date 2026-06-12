import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

import { theme, type PondVariant } from "../theme";

const { width, height } = Dimensions.get("window");

function Pixel({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        backgroundColor: color,
      }}
    />
  );
}

function LilyPad({ x, y, bob }: { x: number; y: number; bob: Animated.Value }) {
  return (
    <Animated.View style={[styles.sprite, { left: x, top: y, transform: [{ translateY: bob }] }]}>
      <Pixel x={0} y={4} w={28} h={6} color={theme.pixelLily} />
      <Pixel x={4} y={0} w={20} h={8} color="#6B8A87" />
      <Pixel x={10} y={2} w={8} h={4} color="#7FA09C" />
    </Animated.View>
  );
}

function ReedCluster({ x, y }: { x: number; y: number }) {
  return (
    <View style={[styles.sprite, { left: x, top: y }]}>
      <Pixel x={4} y={0} w={4} h={48} color={theme.pixelReed} />
      <Pixel x={0} y={8} w={4} h={40} color="#3A6360" />
      <Pixel x={8} y={12} w={4} h={36} color="#254542" />
      <Pixel x={2} y={0} w={8} h={4} color="#4A7A75" />
    </View>
  );
}

function Fish({ x, y, swim }: { x: number; y: number; swim: Animated.Value }) {
  return (
    <Animated.View
      style={[
        styles.sprite,
        {
          top: y,
          transform: [{ translateX: swim }],
        },
      ]}
    >
      <Pixel x={0} y={2} w={14} h={6} color={theme.pixelFish} />
      <Pixel x={12} y={0} w={6} h={4} color="#6EE7B7" />
      <Pixel x={2} y={0} w={2} h={2} color="#042F2E" />
    </Animated.View>
  );
}

function Firefly({ x, y, pulse }: { x: number; y: number; pulse: Animated.Value }) {
  return (
    <Animated.View
      style={[
        styles.sprite,
        {
          left: x,
          top: y,
          opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.95] }),
          transform: [
            {
              translateY: pulse.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }),
            },
          ],
        },
      ]}
    >
      <Pixel x={0} y={0} w={3} h={3} color="#6EE7B7" />
      <Pixel x={1} y={1} w={1} h={1} color="#ECFDF5" />
    </Animated.View>
  );
}

export function PixelPondBackground({ variant = "home" }: { variant?: PondVariant }) {
  const lilyBob1 = useRef(new Animated.Value(0)).current;
  const lilyBob2 = useRef(new Animated.Value(0)).current;
  const fishSwim = useRef(new Animated.Value(-40)).current;
  const firefly1 = useRef(new Animated.Value(0)).current;
  const firefly2 = useRef(new Animated.Value(0)).current;
  const firefly3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bob = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, { toValue: -3, duration: 2200, useNativeDriver: true }),
          Animated.timing(value, { toValue: 3, duration: 2200, useNativeDriver: true }),
        ]),
      );

    const bob1 = bob(lilyBob1, 0);
    const bob2 = bob(lilyBob2, 600);
    bob1.start();
    bob2.start();

    const swim = Animated.loop(
      Animated.sequence([
        Animated.timing(fishSwim, {
          toValue: width + 40,
          duration: 14000,
          useNativeDriver: true,
        }),
        Animated.timing(fishSwim, {
          toValue: -40,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(8000),
      ]),
    );
    swim.start();

    const flicker = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, { toValue: 1, duration: 1800, useNativeDriver: true }),
          Animated.timing(value, { toValue: 0, duration: 2200, useNativeDriver: true }),
        ]),
      );

    const f1 = flicker(firefly1, 200);
    const f2 = flicker(firefly2, 900);
    const f3 = flicker(firefly3, 1600);
    f1.start();
    f2.start();
    f3.start();

    return () => {
      bob1.stop();
      bob2.stop();
      swim.stop();
      f1.stop();
      f2.stop();
      f3.stop();
    };
  }, [firefly1, firefly2, firefly3, fishSwim, lilyBob1, lilyBob2]);

  const dim =
    variant === "triage" ? 0.35 : variant === "monitoring" ? 0.65 : variant === "memory" || variant === "search" ? 0.55 : 1;

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={[styles.pond, { opacity: dim }]}>
        <View style={styles.horizon} />
        <LilyPad x={width * 0.12} y={height * 0.62} bob={lilyBob1} />
        <LilyPad x={width * 0.58} y={height * 0.7} bob={lilyBob2} />
        <LilyPad x={width * 0.78} y={height * 0.58} bob={lilyBob1} />
        <ReedCluster x={width * 0.82} y={height * 0.48} />
        <ReedCluster x={width * 0.04} y={height * 0.52} />
        <Fish x={0} y={height * 0.64} swim={fishSwim} />
        <Firefly x={width * 0.22} y={height * 0.38} pulse={firefly1} />
        <Firefly x={width * 0.48} y={height * 0.32} pulse={firefly2} />
        <Firefly x={width * 0.7} y={height * 0.42} pulse={firefly3} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  pond: {
    flex: 1,
  },
  horizon: {
    position: "absolute",
    left: 0,
    right: 0,
    top: height * 0.45,
    height: 1,
    backgroundColor: "rgba(131, 181, 181, 0.12)",
  },
  sprite: {
    position: "absolute",
  },
});
