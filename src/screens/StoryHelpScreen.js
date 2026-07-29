// shows the matched relief organizations for one specific story
// reached either by tapping the help icon on a feed card, or the help
// icon inside the article reader - both pass the same story info along

import { ScrollView, Text, StyleSheet, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HelpCard from '../components/HelpCard';
import { matchHelpOrganizations } from '../utils/matchHelpOrganizations';
import { colors, fonts } from '../theme';

export default function StoryHelpScreen({ route, navigation }) {
  const { title, summary } = route.params;

  // matchHelpOrganizations only needs title + summary text to work with
  const organizations = matchHelpOrganizations({ title, summary });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How you can help</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.disclaimer}>
          Always verify an organization on its official site before donating.
        </Text>

        <HelpCard story={{ title, summary }} organizations={organizations} />
      </ScrollView>
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
  },
  scrollContent: {
    padding: 20,
  },
  disclaimer: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 16,
  },
});