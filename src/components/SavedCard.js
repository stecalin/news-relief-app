// a single saved-article tile for the two-column grid on the Saved screen
// tapping the card opens the article; tapping the bookmark icon removes it

import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

// formats a date like "Oct 24, 2024" to match the reference's byline style
function formatDate(publishedAt) {
  const date = new Date(publishedAt);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SavedCard({ savedArticle, onPress, onRemove }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrapper}>
        {savedArticle.imageUrl && (
          <Image source={{ uri: savedArticle.imageUrl }} style={styles.image} />
        )}

        <TouchableOpacity style={styles.bookmarkButton} onPress={onRemove}>
          <Ionicons name="bookmark" size={16} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={3}>
          {savedArticle.title}
        </Text>
        <Text style={styles.date}>{formatDate(savedArticle.publishedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    backgroundColor: colors.border,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 10,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
    marginBottom: 6,
  },
  date: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});