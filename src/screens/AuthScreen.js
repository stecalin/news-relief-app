// one screen that handles both logging in and signing up
// toggling "isSigningUp" switches which mode it's in and which firebase
// function gets called when the button is pressed

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme';

export default function AuthScreen() {
  const { signUp, logIn } = useAuth();

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (isSigningUp) {
        await signUp(email, password);
      } else {
        await logIn(email, password);
      }
      // no navigation needed here - AuthContext's onAuthStateChanged listener
      // picks up the change automatically and the navigator reacts to it
    } catch (error) {
      setErrorMessage(readableErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>{isSigningUp ? 'Create an account' : 'Welcome back'}</Text>
        <Text style={styles.subtitle}>
          {isSigningUp
            ? 'Sign up to comment on stories and save your profile.'
            : 'Log in to continue.'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Please wait...' : isSigningUp ? 'Sign up' : 'Log in'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSigningUp((current) => !current)}>
          <Text style={styles.toggleText}>
            {isSigningUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// firebase's raw error codes aren't user-friendly - this translates the
// common ones into plain language
function readableErrorMessage(error) {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'That email address doesn\'t look right.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 28,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.breaking,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  toggleText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.accent,
    textAlign: 'center',
  },
});