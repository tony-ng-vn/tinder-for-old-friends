import {
  JetBrainsMono_500Medium,
} from "@expo-google-fonts/jetbrains-mono";
import {
  PressStart2P_400Regular,
} from "@expo-google-fonts/press-start-2p";
import { MOBILE_ROUTES } from "@relationship-memory/shared";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ScreenShell } from "./src/components/ScreenShell";
import { SessionProvider } from "./src/context/SessionContext";
import { HomeScreen } from "./src/screens/HomeScreen";
import { MemoryScreen } from "./src/screens/MemoryScreen";
import { MonitoringScreen } from "./src/screens/MonitoringScreen";
import { SearchScreen } from "./src/screens/SearchScreen";
import { TriageScreen } from "./src/screens/TriageScreen";
import { theme } from "./src/theme";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
    JetBrainsMono_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.keep} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SessionProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.bgTop,
              },
              headerShadowVisible: false,
              headerTintColor: theme.keep,
              headerTitleStyle: {
                fontFamily: theme.fonts.mono,
                fontSize: 12,
                color: theme.textMono,
              },
              contentStyle: { backgroundColor: "transparent" },
            }}
          >
            <Stack.Screen name={MOBILE_ROUTES.Home} options={{ title: "Home" }}>
              {(props) => (
                <ScreenShell variant="home">
                  <HomeScreen {...props} />
                </ScreenShell>
              )}
            </Stack.Screen>
            <Stack.Screen
              name={MOBILE_ROUTES.Monitoring}
              options={{ title: "Monitoring" }}
            >
              {(props) => (
                <ScreenShell variant="monitoring">
                  <MonitoringScreen {...props} />
                </ScreenShell>
              )}
            </Stack.Screen>
            <Stack.Screen name={MOBILE_ROUTES.Triage} options={{ title: "Triage" }}>
              {() => (
                <ScreenShell variant="triage">
                  <TriageScreen />
                </ScreenShell>
              )}
            </Stack.Screen>
            <Stack.Screen name={MOBILE_ROUTES.Memory} options={{ title: "Memory" }}>
              {() => (
                <ScreenShell variant="memory">
                  <MemoryScreen />
                </ScreenShell>
              )}
            </Stack.Screen>
            <Stack.Screen name={MOBILE_ROUTES.Search} options={{ title: "Search" }}>
              {() => (
                <ScreenShell variant="search">
                  <SearchScreen />
                </ScreenShell>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bgTop },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.bgTop,
  },
});
