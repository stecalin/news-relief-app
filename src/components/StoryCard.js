// a single story card - shows an image, the headline, a category tag, and how long ago it was posted
// this component doesn't care where the data came from, it just displays whatever story it's given

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

// turns a timestamp into something like "2h ago" or "5d ago"
function getRelativeTime(publishedAt) {
  const now = new Date();
  const then = new Date(publishedAt);
  const diffMs = now - then;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function StoryCard({ story, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: story.imageUrl }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.tagRow}>
          <Text style={styles.category}>{story.category}</Text>
          <Text style={styles.time}>{getRelativeTime(story.publishedAt)}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {story.title}
        </Text>

        <Text style={styles.summary} numberOfLines={2}>
          {story.summary}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#e5e5e5',
  },
  content: {
    padding: 14,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f6e56',
    textTransform: 'uppercase',
  },
  time: {
    fontSize: 12,
    color: '#8a8a8a',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    lineHeight: 22,
  },
  summary: {
    fontSize: 14,
    color: '#5a5a5a',
    lineHeight: 20,
  },
});