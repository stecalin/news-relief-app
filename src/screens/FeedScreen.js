// main feed screen
// shows a "breaking" section up top, then a "trending" section below sorted newest to oldest
// the whole thing scrolls together as one feed, like the reference screenshot

import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import StoryCard from '../components/StoryCard';
import { placeholderStories } from '../data/placeholderStories';

export default function FeedScreen() {
  // breaking stories: whatever is flagged isBreaking
  const breakingStories = placeholderStories.filter((story) => story.isBreaking);

  // trending stories: everything else, sorted newest first
  const trendingStories = placeholderStories
    .filter((story) => !story.isBreaking)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Today</Text>

        {/* breaking news section */}
        <Text style={styles.sectionHeader}>Breaking</Text>
        {breakingStories.map((story) => (
          <StoryCard key={story.id} story={story} onPress={() => {}} />
        ))}

        {/* trending section, newest to oldest */}
        <Text style={styles.sectionHeader}>Trending</Text>
        {trendingStories.map((story) => (
          <StoryCard key={story.id} story={story} onPress={() => {}} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f4f0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 8,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});