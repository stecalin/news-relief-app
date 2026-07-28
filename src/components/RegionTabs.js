// a row of tappable pills for switching between news regions

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

export default function RegionTabs({ regions, selectedKey, onSelect }) {
  return (
    <View style={styles.row}>
      {regions.map((region) => {
        const isSelected = region.key === selectedKey;
        return (
          <TouchableOpacity
            key={region.key}
            style={[styles.tab, isSelected && styles.tabSelected]}
            onPress={() => onSelect(region.key)}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {region.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  tabSelected: {
    backgroundColor: colors.accent,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  labelSelected: {
    fontFamily: fonts.bold,
    color: '#FFFFFF',
  },
});