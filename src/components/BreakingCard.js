// full-width breaking news card used inside the horizontal-scrolling
// carousel - image on top, then a source attribution row (small circle
// avatar + name + time), then the headline, then a how-to-help button

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import { getRelativeTime } from '../utils/relativeTime';

export default function BreakingCard({ story, cardWidth, onPress, onHelpPress, isSaved, onToggleSave }) {
  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrapper}>
        {story.imageUrl && <Image source={{ uri: story.imageUrl }} style={styles.image} />}

        <TouchableOpacity style={styles.bookmarkButton} onPress={onToggleSave}>
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={isSaved ? colors.accent : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.sourceRow}>
          <View style={styles.sourceAvatar}>
            <Text style={styles.sourceAvatarLetter}>{story.category.charAt(0)}</Text>
          </View>
          <Text style={styles.sourceName} numberOfLines={1}>
            {story.category}
          </Text>
          <Text style={styles.sourceDot}>•</Text>
          <Text style={styles.sourceTime}>{getRelativeTime(story.publishedAt)}</Text>
        </View>

        <Text style={styles.title} numberOfLines={3}>
          {story.title}
        </Text>

        <TouchableOpacity style={styles.helpButton} onPress={onHelpPress}>
          <Ionicons name="heart-outline" size={13} color={colors.help} />
          <Text style={styles.helpButtonText}>How to help</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: colors.border,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  sourceAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceAvatarLetter: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.accent,
  },
  sourceName: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  sourceDot: {
    fontSize: 12,
    color: colors.textMuted,
  },
  sourceTime: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
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
});