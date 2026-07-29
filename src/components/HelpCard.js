// shows a story's headline plus the relief organizations matched to it,
// each with a short description and a link straight to their official site

import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

export default function HelpCard({ story, organizations }) {
  return (
    <View style={styles.card}>
      <Text style={styles.storyTitle} numberOfLines={2}>
        {story.title}
      </Text>

      {organizations.map((org) => (
        <View key={org.id} style={styles.orgRow}>
          <View style={styles.orgTextContainer}>
            <Text style={styles.orgName}>{org.name}</Text>
            <Text style={styles.orgDescription}>{org.description}</Text>
          </View>

          <TouchableOpacity
            style={styles.visitButton}
            onPress={() => Linking.openURL(org.url)}
          >
            <Text style={styles.visitButtonText}>Visit</Text>
            <Ionicons name="open-outline" size={14} color={colors.help} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  storyTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 12,
    lineHeight: 20,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.helpLight,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  orgTextContainer: {
    flex: 1,
  },
  orgName: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.help,
    marginBottom: 3,
  },
  orgDescription: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  visitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  visitButtonText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.help,
  },
});