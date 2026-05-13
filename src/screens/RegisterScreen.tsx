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
import type { RegisterScreenProps } from '../types/navigation';
import { colors, radius, spacing, typography } from '../theme';

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!name.trim()) return 'Please enter your name.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'Please enter a valid email address.';
    if (!password || password.length < 6)
      return 'Password must be at least 6 characters.';
    return null;
  };

  const onSubmit = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signUp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() || undefined,
      });
      navigation.canGoBack()
        ? navigation.goBack()
        : navigation.replace('Home');
    } catch (e: any) {
      setError(e?.message ?? 'Sign up failed');
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
          <Text style={styles.heading}>Create your account</Text>
          <Text style={styles.subtitle}>
            Join ZARR — track orders, save favourites and unlock member-only
            offers.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />

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

            <Text style={styles.label}>PHONE (OPTIONAL)</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              placeholder="+92 ..."
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
                autoComplete="password-new"
                placeholder="At least 6 characters"
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
                <Text style={styles.primaryText}>CREATE ACCOUNT</Text>
              )}
            </Pressable>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Already a member? </Text>
              <Pressable onPress={() => navigation.replace('Login')}>
                <Text style={styles.bottomLink}>Sign in</Text>
              </Pressable>
            </View>
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
    fontSize: 26,
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
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  bottomText: { ...typography.small, color: colors.textMuted },
  bottomLink: {
    ...typography.smallMed,
    color: colors.text,
    textDecorationLine: 'underline',
  },
});
