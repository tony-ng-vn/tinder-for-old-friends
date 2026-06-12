import React, { useCallback, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
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

type SearchMatch = Encounter & { score: number; reason: string };

function filterClientSide(query: string, encounters: Encounter[]): SearchMatch[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return encounters
    .map((e) => {
      const haystack = [e.name, e.company, e.location, e.context, e.role, e.event_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const words = q.split(/\s+/);
      const matched = words.filter((w) => haystack.includes(w)).length;
      if (matched === 0) return null;
      const score = matched / words.length;
      return {
        ...e,
        score,
        reason: `Matched ${matched} term${matched === 1 ? "" : "s"}`,
      };
    })
    .filter((m): m is SearchMatch => m !== null)
    .sort((a, b) => b.score - a.score);
}

export function SearchScreen() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [kept, setKept] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      api.listEncounters("kept").then(({ encounters }) => setKept(encounters));
    }, []),
  );

  const search = async (text?: string) => {
    const q = (text ?? query).trim();
    if (!q) {
      setMatches([]);
      return;
    }
    setQuery(q);
    setLoading(true);
    try {
      const { matches: apiMatches } = await api.search(q);
      if (apiMatches.length > 0) {
        setMatches(apiMatches);
      } else {
        setMatches(filterClientSide(q, kept));
      }
    } catch {
      setMatches(filterClientSide(q, kept));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Name, company, location, or memory…"
          placeholderTextColor={theme.textMuted}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => search()}
          returnKeyType="search"
          autoCorrect={false}
        />
        <Text style={styles.searchAction} onPress={() => search()}>
          {loading ? "…" : "Search"}
        </Text>
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={galleryColumnWrapper}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.empty}>
            {query.trim()
              ? "No matches"
              : "Search your memory — e.g. Stripe engineer in San Francisco"}
          </Text>
        }
        renderItem={({ item, index }) => (
          <View style={galleryItemSpacing(index)}>
            <EncounterGalleryCard
              encounter={item}
              subtitle={`${Math.round(item.score * 100)}% · ${item.reason}`}
            />
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.glassBorder,
    backgroundColor: theme.panelBg,
    gap: 12,
  },
  input: {
    flex: 1,
    color: theme.text,
    fontSize: 16,
    paddingVertical: 8,
  },
  searchAction: {
    color: theme.keep,
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  listContent: { paddingTop: 16, paddingBottom: 24 },
  empty: { color: theme.textMuted, textAlign: "center", marginTop: 32, paddingHorizontal: 24 },
});
