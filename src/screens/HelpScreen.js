// how you can help tab - reuses the same news data as the feed, but shows
// each story alongside relief organizations matched to its topic

import { useMemo } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import HelpCard from '../components/HelpCard';
import RegionTabs from '../components/RegionTabs';
import { useNewsFeeds } from '../hooks/useNewsFeeds';
import { matchHelpOrganizations } from '../utils/matchHelpOrganizations';
import { colors, fonts } from '../theme';

export default function HelpScreen() {
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

  const activeStories = useMemo(() => feeds[selectedRegion] || [], [feeds, selectedRegion]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.help} />
        <Text style={styles.loadingText}>Finding ways to help...</Text>
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>Couldn't load stories.</Text>
        <Text style={styles.errorDetail}>{errorMessage}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.help} />
        }
      >
        <Text style={styles.pageTitle}>How you can help</Text>
        <Text style={styles.disclaimer}>
          Always verify an organization on its official site before donating.
        </Text>

        <RegionTabs
          regions={availableRegions}
          selectedKey={selectedRegion}
          onSelect={setSelectedRegion}
        />

        {activeStories.map((story) => (
          <HelpCard key={story.id} story={story} organizations={matchHelpOrganizations(story)} />
        ))}
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
    marginBottom: 8,
  },
  disclaimer: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 18,
  },
});