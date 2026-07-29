// shows the login/sign-up screen if nobody's logged in, otherwise shows
// the logged-in user's info and a log out button

import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthScreen from './AuthScreen';
import { colors, fonts } from '../theme';

export default function ProfileScreen() {
  const { user, logOut } = useAuth();

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>{user.email.charAt(0).toUpperCase()}</Text>
        </View>

        <Text style={styles.email}>{user.email}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLetter: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: '#FFFFFF',
  },
  email: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 24,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  logoutButtonText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
});