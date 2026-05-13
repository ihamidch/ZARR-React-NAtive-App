import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import type { LoginScreenProps } from '../types/navigation';
import { colors, radius, spacing, typography } from '../theme';

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email.trim().toLowerCase(), password);
      navigation.canGoBack()
        ? navigation.goBack()
        : navigation.replace('Home');
    } catch (e: any) {
      setError(e?.message ?? 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.titleWrap}>
          <Text style={styles.brand}>ZARR</Text>
          <View style={styles.brandUnderline} />
        </View>
        <View style={styles.iconBtn} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to view orders, save favourites and check out faster.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />

            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                placeholder="Your password"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              style={[styles.primary, submitting && styles.primaryDisabled]}
              onPress={onSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.primaryText}>SIGN IN</Text>
              )}
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={styles.secondary}
              onPress={() => navigation.replace('Register')}
            >
              <Text style={styles.secondaryText}>CREATE ACCOUNT</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 56,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { flex: 1, alignItems: 'center' },
  brand: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    letterSpacing: 5,
    color: colors.text,
  },
  brandUnderline: {
    width: 32,
    height: 1.5,
    backgroundColor: colors.text,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  heading: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    lineHeight: 20,
  },
  form: { marginTop: spacing.md },
  label: {
    ...typography.tiny,
    color: colors.text,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  input: {
    height: 48,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  eyeBtn: {
    width: 40,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    height: 50,
    backgroundColor: colors.text,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  primaryDisabled: { opacity: 0.7 },
  primaryText: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
    fontSize: 13,
  },
  errorText: {
    ...typography.small,
    color: colors.sale,
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { ...typography.tiny, color: colors.textMuted, letterSpacing: 2 },
  secondary: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: colors.text,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
    fontSize: 13,
  },
});
