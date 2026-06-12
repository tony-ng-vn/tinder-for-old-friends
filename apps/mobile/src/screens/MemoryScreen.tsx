import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { api, type Encounter } from "../api";
import {
  EncounterGalleryCard,
  galleryColumnWrapper,
  galleryItemSpacing,
} from "../components/EncounterGalleryCard";
import { theme } from "../theme";

export function MemoryScreen() {
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const { encounters: list } = await api.listEncounters("kept");
      setEncounters(list);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={encounters}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={galleryColumnWrapper}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyPixel}>Empty pond</Text>
            <Text style={styles.empty}>People you Keep will appear here</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={galleryItemSpacing(index)}>
            <EncounterGalleryCard
              encounter={item}
              subtitle={item.context ?? undefined}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingTop: 16, paddingBottom: 24 },
  emptyWrap: { alignItems: "center", marginTop: 40, gap: 8, paddingHorizontal: 24 },
  emptyPixel: {
    color: theme.text,
    fontFamily: theme.fonts.pixel,
    fontSize: 11,
    textAlign: "center",
  },
  empty: { color: theme.textMuted, textAlign: "center" },
});
