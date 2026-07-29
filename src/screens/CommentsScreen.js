// comment thread for a single article - shows existing comments in
// real time and lets logged-in users post their own, reddit-thread style

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { subscribeToComments, postComment, deleteComment } from '../api/commentsApi';
import { getArticleId } from '../utils/articleId';
import { colors, fonts } from '../theme';

export default function CommentsScreen({ route, navigation }) {
  const { url, title } = route.params;
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [draftText, setDraftText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const articleId = getArticleId(url);

  // subscribes when the screen opens, unsubscribes when it closes
  useEffect(() => {
    const unsubscribe = subscribeToComments(articleId, setComments);
    return unsubscribe;
  }, [articleId]);

  const handlePost = async () => {
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No comments yet. Be the first to share your thoughts.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.commentRow}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentAuthor}>{item.userEmail}</Text>

              {user?.uid === item.userId && (
                <TouchableOpacity onPress={() => deleteComment(item.id)}>
                  <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
        )}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
              onPress={handlePost}
              disabled={isPosting || !draftText.trim()}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Log in from the Profile tab to comment.</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
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
    marginBottom: 4,
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
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: 8,
  },
  composerInput: {
    flex: 1,
    backgroundColor: colors.background,
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
  loginPrompt: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  loginPromptText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});