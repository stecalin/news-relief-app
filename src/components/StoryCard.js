// a single story card - big rounded image on top, headline and summary below,
// with a category pill and a small clock + time row, styled after the reference design

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import { getRelativeTime } from '../utils/relativeTime';

// turns a timestamp into something like "2h ago" or "5d ago"
/*function getRelativeTime(publishedAt) {
  const now = new Date();
  const then = new Date(publishedAt);
  const diffMs = now - then;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}*/

export default function StoryCard({ story, onPress, onHelpPress, isSaved, onToggleSave }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {story.imageUrl && (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: story.imageUrl }} style={styles.image} />

          <TouchableOpacity style={styles.bookmarkButton} onPress={onToggleSave}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={isSaved ? colors.accent : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.tagRow}>
          <View style={[styles.pill, story.isBreaking && styles.pillBreaking]}>
            <Text style={[styles.pillText, story.isBreaking && styles.pillTextBreaking]}>
              {story.isBreaking ? 'Breaking' : story.category}
            </Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {story.title}
        </Text>

        <Text style={styles.summary} numberOfLines={2}>
          {story.summary}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={styles.time}>{getRelativeTime(story.publishedAt)}</Text>
          </View>

          <TouchableOpacity style={styles.helpButton} onPress={onHelpPress}>
            <Ionicons name="heart-outline" size={14} color={colors.help} />
            <Text style={styles.helpButtonText}>How to help</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginBottom: 18,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 190,
    backgroundColor: colors.border,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  pill: {
    backgroundColor: colors.accentLight,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  pillBreaking: {
    backgroundColor: colors.breakingLight,
  },
  pillText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  pillTextBreaking: {
    color: colors.breaking,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.textPrimary,
    marginBottom: 6,
    lineHeight: 23,
  },
  summary: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helpButtonText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.help,
  },
  time: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
});