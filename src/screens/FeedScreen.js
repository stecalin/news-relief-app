// main feed screen
// fetches three separate feeds - the user's own country, us, and international -
// lets the user switch tabs and search within the current tab, and splits
// stories into "breaking" (last 6 hours) and "trending" (everything else)

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import StoryCard from '../components/StoryCard';
import RegionTabs from '../components/RegionTabs';
import SearchBar from '../components/SearchBar';
import { fetchByCountry, fetchInternational, getUserCountryCode } from '../api/newsApi';
import { colors, fonts } from '../theme';

export default function FeedScreen({ navigation }) {
  const [feeds, setFeeds] = useState({ local: [], us: [], international: [] });
  const [availableRegions, setAvailableRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const loadAllFeeds = useCallback(async () => {
    setErrorMessage(null);

    const userCountryCode = getUserCountryCode();
    const showLocalTab = userCountryCode && userCountryCode !== 'us';

    const results = await Promise.allSettled([
      showLocalTab ? fetchByCountry(userCountryCode) : Promise.resolve([]),
      fetchByCountry('us'),
      fetchInternational(),
    ]);

    const [localResult, usResult, internationalResult] = results;

    const nextFeeds = {
      local: localResult.status === 'fulfilled' ? localResult.value : [],
      us: usResult.status === 'fulfilled' ? usResult.value : [],
      international: internationalResult.status === 'fulfilled' ? internationalResult.value : [],
    };

    const nextRegions = [];
    if (showLocalTab && nextFeeds.local.length > 0) {
      nextRegions.push({ key: 'local', label: 'Your country' });
    }
    if (nextFeeds.us.length > 0) {
      nextRegions.push({ key: 'us', label: 'US' });
    }
    if (nextFeeds.international.length > 0) {
      nextRegions.push({ key: 'international', label: 'International' });
    }

    if (nextRegions.length === 0) {
      setErrorMessage("Couldn't load news from any region right now.");
    }

    setFeeds(nextFeeds);
    setAvailableRegions(nextRegions);
    setSelectedRegion((current) =>
      nextRegions.some((region) => region.key === current) ? current : nextRegions[0]?.key
    );
  }, []);

  useEffect(() => {
    loadAllFeeds().finally(() => setIsLoading(false));
  }, [loadAllFeeds]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAllFeeds();
    setIsRefreshing(false);
  };

  // filters the active region's stories by whatever is typed in the search bar
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

  const breakingStories = activeStories.filter((story) => story.isBreaking);
  const trendingStories = activeStories
    .filter((story) => !story.isBreaking)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

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
            {breakingStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onPress={() => navigation.navigate('Article', { url: story.sourceUrl, sourceName: story.category })}
              />
            ))}
          </>
        )}

        <Text style={styles.sectionHeader}>Trending</Text>
        {trendingStories.length > 0 ? (
          trendingStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onPress={() => navigation.navigate('Article', { url: story.sourceUrl, sourceName: story.category })}
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