// horizontal, swipeable carousel for the breaking news cards - snaps one
// card at a time and shows small paging dots underneath, similar to the
// reference design

import { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import BreakingCard from './BreakingCard';
import { colors } from '../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDE_PADDING = 20;
const CARD_WIDTH = SCREEN_WIDTH - SIDE_PADDING * 2;
const CARD_GAP = 14;

export default function BreakingCarousel({ stories, onPress, onHelpPress, isSaved, onToggleSave }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // figures out which card is currently centered once the user stops scrolling
  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_GAP));
    setActiveIndex(index);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {stories.map((story, index) => (
          <View key={story.id} style={index < stories.length - 1 && { marginRight: CARD_GAP }}>
            <BreakingCard
              story={story}
              cardWidth={CARD_WIDTH}
              onPress={() => onPress(story)}
              onHelpPress={() => onHelpPress(story)}
              isSaved={isSaved(story)}
              onToggleSave={() => onToggleSave(story)}
            />
          </View>
        ))}
      </ScrollView>

      {stories.length > 1 && (
        <View style={styles.dotsRow}>
          {stories.map((story, index) => (
            <View
              key={story.id}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: -SIDE_PADDING,
  },
  scrollContent: {
    paddingHorizontal: SIDE_PADDING,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 16,
    backgroundColor: colors.accent,
  },
});