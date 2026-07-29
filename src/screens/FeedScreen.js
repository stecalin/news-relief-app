// main feed screen
// breaking news is a swipeable carousel of full-width cards up top,
// trending news is a normal vertical list below it, newest to oldest

import { useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import StoryCard from '../components/StoryCard';
import BreakingCarousel from '../components/BreakingCarousel';
import RegionTabs from '../components/RegionTabs';
import SearchBar from '../components/SearchBar';
import { useNewsFeeds } from '../hooks/useNewsFeeds';
import { useSavedArticles } from '../context/SavedArticlesContext';
import { colors, fonts } from '../theme';

export default function FeedScreen({ navigation }) {
  const {
    feeds,
    availableRegions,
    selectedRegion,
    setSelectedRegion,
    isLoading,
    isRefreshing,
    errorMessage,
    handleRefresh,
  } = useNewsFeeds();

  const { isSaved, toggleSave } = useSavedArticles();
  const [searchText, setSearchText] = useState('');

  const activeStories = useMemo(() => {
    const stories = feeds[selectedRegion] || [];
    if (!searchText.trim()) return stories;

    const query = searchText.trim().toLowerCase();
    return stories.filter(
      (story) =>
        story.title.toLowerCase().includes(query) ||
        story.summary.toLowerCase().includes(query)
    );
  }, [feeds, selectedRegion, searchText]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading today's news...</Text>
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>Couldn't load the news.</Text>
        <Text style={styles.errorDetail}>{errorMessage}</Text>
      </SafeAreaView>
    );
  }

  // only the 5 most recent breaking-eligible stories actually show as
  // "breaking" - anything past that, even if it's within the time window,
  // falls back into trending instead of taking over the whole carousel
  const MAX_BREAKING_STORIES = 5;

  const breakingCandidates = activeStories
    .filter((story) => story.isBreaking)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  const breakingStories = breakingCandidates.slice(0, MAX_BREAKING_STORIES);
  const overflowBreaking = breakingCandidates.slice(MAX_BREAKING_STORIES);

  const trendingStories = [...activeStories.filter((story) => !story.isBreaking), ...overflowBreaking]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
  const openArticle = (story) => navigation.navigate('Article', { story });
  const openHelp = (story) =>
    navigation.navigate('StoryHelp', { title: story.title, summary: story.summary });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.accent} />
        }
      >
        <Text style={styles.pageTitle}>Today</Text>

        <SearchBar value={searchText} onChangeText={setSearchText} />

        <RegionTabs
          regions={availableRegions}
          selectedKey={selectedRegion}
          onSelect={setSelectedRegion}
        />

        {breakingStories.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>Breaking</Text>
            <BreakingCarousel
              stories={breakingStories}
              onPress={openArticle}
              onHelpPress={openHelp}
              isSaved={isSaved}
              onToggleSave={toggleSave}
            />
          </>
        )}

        <Text style={styles.sectionHeader}>Trending</Text>
        {trendingStories.length > 0 ? (
          trendingStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onPress={() => openArticle(story)}
              onHelpPress={() => openHelp(story)}
              isSaved={isSaved(story)}
              onToggleSave={() => toggleSave(story)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No stories match your search.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorText: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  errorDetail: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  pageTitle: {
    fontFamily: fonts.bold,
    fontSize: 30,
    color: colors.textPrimary,
    marginBottom: 18,
  },
  sectionHeader: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 6,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
});