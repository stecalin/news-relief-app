// article preview screen
// shows our hero image, headline, and short summary, a button to read the
// full piece, a how-to-help button, and then the comment thread for this
// story shown directly on the page - no separate comments screen anymore

import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Share,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSavedArticles } from '../context/SavedArticlesContext';
import { subscribeToComments, postComment, deleteComment } from '../api/commentsApi';
import { getArticleId } from '../utils/articleId';
import { getRelativeTime } from '../utils/relativeTime';
import { colors, fonts } from '../theme';

export default function ArticleScreen({ route, navigation }) {
  const { story } = route.params;
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedArticles();

  const [comments, setComments] = useState([]);
  const [draftText, setDraftText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const saved = isSaved(story);
  const articleId = getArticleId(story.sourceUrl);

  // tracks scroll position so the hero image can shrink away as the
  // user scrolls down into the comments, instead of staying fixed
  const scrollY = useRef(new Animated.Value(0)).current;

  const heroImageHeight = scrollY.interpolate({
    inputRange: [0, 260],
    outputRange: [300, 0],
    extrapolate: 'clamp',
  });

  const heroImageOpacity = scrollY.interpolate({
    inputRange: [0, 200, 260],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, 260],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const unsubscribe = subscribeToComments(articleId, setComments);
    return unsubscribe;
  }, [articleId]);

  const handlePostComment = async () => {
    if (!draftText.trim() || !user) return;

    setIsPosting(true);
    try {
      await postComment({ articleId, text: draftText.trim(), user });
      setDraftText('');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={[styles.pinnedHeaderBackground, { opacity: headerBackgroundOpacity }]} />

        <View style={styles.floatingHeader}>
          <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.floatingRightButtons}>
            <TouchableOpacity style={styles.floatingButton} onPress={() => toggleSave(story)}>
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={saved ? colors.accent : colors.textPrimary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() => Share.share({ message: story.title, url: story.sourceUrl })}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.ScrollView
          bounces={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
        >
          <Animated.View style={{ height: heroImageHeight, opacity: heroImageOpacity, overflow: 'hidden' }}>
            {story.imageUrl && <Image source={{ uri: story.imageUrl }} style={styles.heroImage} />}
          </Animated.View>

          <View style={styles.content}>
            <Text style={styles.title}>{story.title}</Text>

            <Text style={styles.metaLine}>
              {story.isBreaking ? 'Breaking' : 'Trending'} • {getRelativeTime(story.publishedAt)}
            </Text>

            <View style={styles.sourceCard}>
              <View style={styles.sourceAvatar}>
                <Text style={styles.sourceAvatarLetter}>{story.category.charAt(0)}</Text>
              </View>
              <Text style={styles.sourceName}>{story.category}</Text>
            </View>

            <Text style={styles.summary}>{story.summary}</Text>

            <TouchableOpacity
              style={styles.readFullButton}
              onPress={() =>
                navigation.navigate('ArticleReader', { url: story.sourceUrl, sourceName: story.category })
              }
            >
              <Text style={styles.readFullButtonText}>Read full article</Text>
              <Ionicons name="open-outline" size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.helpButton}
              onPress={() =>
                navigation.navigate('StoryHelp', { title: story.title, summary: story.summary })
              }
            >
              <Ionicons name="heart-outline" size={18} color={colors.help} />
              <Text style={styles.helpButtonText}>How to help</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <Text style={styles.commentsHeader}>
              Comments {comments.length > 0 ? `(${comments.length})` : ''}
            </Text>

            {comments.length === 0 && (
              <Text style={styles.emptyCommentsText}>
                No comments yet. Be the first to share your thoughts.
              </Text>
            )}

            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentRow}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.userEmail}</Text>

                  {user?.uid === comment.userId && (
                    <TouchableOpacity onPress={() => deleteComment(comment.id)}>
                      <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}

            {user ? (
              <View style={styles.composer}>
                <TextInput
                  style={styles.composerInput}
                  placeholder="Add a comment"
                  placeholderTextColor={colors.textMuted}
                  value={draftText}
                  onChangeText={setDraftText}
                  multiline
                />
                <TouchableOpacity
                  style={styles.postButton}
                  onPress={handlePostComment}
                  disabled={isPosting || !draftText.trim()}
                >
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.loginPromptText}>Log in from the Profile tab to comment.</Text>
            )}
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: colors.border,
  },
  pinnedHeaderBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  floatingHeader: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  floatingRightButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  floatingButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.textPrimary,
    lineHeight: 29,
    marginBottom: 8,
  },
  metaLine: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 18,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
    gap: 10,
  },
  sourceAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceAvatarLetter: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.accent,
  },
  sourceName: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  summary: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 23,
    marginBottom: 24,
  },
  readFullButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 14,
    height: 50,
    marginBottom: 12,
  },
  readFullButtonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  helpButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.help,
    borderRadius: 14,
    height: 48,
  },
  helpButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.help,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
  commentsHeader: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  emptyCommentsText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 16,
  },
  commentRow: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.accent,
  },
  commentText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  composerInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  postButton: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPromptText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
});