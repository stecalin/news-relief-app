// rounded search bar, styled after the reference design
// this doesn't call any api - it just filters whatever stories are already
// loaded in the current tab, by matching the title or summary text

import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={colors.accent} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search news"
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 48,
    gap: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.textPrimary,
  },
});