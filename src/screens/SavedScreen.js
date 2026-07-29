// shows the logged-in user's saved articles in a two-column grid,
// styled after "the archives" reference layout - masthead title, filter
// pills up top, and cards with a bookmark icon in the corner of each

import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useSavedArticles } from '../context/SavedArticlesContext';
import { unsaveArticle } from '../api/savedArticlesApi';
import AuthScreen from './AuthScreen';
import SavedCard from '../components/SavedCard';
import { colors, fonts } from '../theme';

// filter pills - "all" plus whatever categories actually show up in the
// user's saved articles, so the row never shows empty filters
const ALL_FILTER = 'All';

export default function SavedScreen({ navigation }) {
  const { user } = useAuth();
  const { savedArticles } = useSavedArticles();
  const [selectedFilter, setSelectedFilter] = useState(ALL_FILTER);

  const availableFilters = useMemo(() => {
    const categories = new Set(savedArticles.map((entry) => entry.category));
    return [ALL_FILTER, ...categories];
  }, [savedArticles]);

  const visibleArticles = useMemo(() => {
    if (selectedFilter === ALL_FILTER) return savedArticles;
    return savedArticles.filter((entry) => entry.category === selectedFilter);
  }, [savedArticles, selectedFilter]);

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Saved</Text>
        <Text style={styles.pageSubtitle}>Your personal collection of stories</Text>
      </View>

      <FlatList
        data={availableFilters}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        style={styles.filterRow}
        contentContainerStyle={styles.filterRowContent}
        renderItem={({ item }) => {
          const isSelected = item === selectedFilter;
          return (
            <TouchableOpacity
              style={[styles.filterPill, isSelected && styles.filterPillSelected]}
              onPress={() => setSelectedFilter(item)}
            >
              <Text style={[styles.filterLabel, isSelected && styles.filterLabelSelected]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <FlatList
        data={visibleArticles}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nothing saved yet. Tap the bookmark icon on any story to add it here.
          </Text>
        }
        renderItem={({ item }) => (
          <SavedCard
            savedArticle={item}
            onPress={() =>
              navigation.navigate('Article', {
                story: {
                  id: item.id,
                  title: item.title,
                  summary: item.summary,
                  imageUrl: item.imageUrl,
                  category: item.category,
                  publishedAt: item.publishedAt,
                  isBreaking: false,
                  sourceUrl: item.sourceUrl,
                },
              })
            }
            onRemove={() => unsaveArticle(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  pageTitle: {
    fontFamily: fonts.bold,
    fontSize: 30,
    color: colors.textPrimary,
  },
  pageSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  filterRow: {
    flexGrow: 0,
    marginBottom: 8,
  },
  filterRowContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  filterPillSelected: {
    backgroundColor: colors.accent,
  },
  filterLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  filterLabelSelected: {
    fontFamily: fonts.bold,
    color: '#FFFFFF',
  },
  gridContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  gridRow: {
    gap: 12,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
});