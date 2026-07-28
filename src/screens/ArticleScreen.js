// shows the original article inside the app using a webview, instead of
// sending the user out to their phone's browser. we never copy or store
// the article's actual text - we just display the publisher's real page,
// with a small header crediting the source
//
// note: react-native-webview only works on real ios/android, not in a
// web browser - so on web we fall back to opening the link in a new tab

import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

export default function ArticleScreen({ route, navigation }) {
  const { url, sourceName } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.sourceLabel} numberOfLines={1}>
          via {sourceName}
        </Text>
      </View>

      {Platform.OS === 'web' ? (
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackText}>
            In-app reading only works in the phone app. On web, open the article in a new tab instead.
          </Text>
          <TouchableOpacity style={styles.webFallbackButton} onPress={() => Linking.openURL(url)}>
            <Text style={styles.webFallbackButtonText}>Open article</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView source={{ uri: url }} style={styles.webview} />
      )}
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
  sourceLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  webFallbackText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  webFallbackButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  webFallbackButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
});