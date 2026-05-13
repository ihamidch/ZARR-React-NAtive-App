import React, { useState } from 'react';
import {
  Alert,
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
import type { AccountScreenProps } from '../types/navigation';
import { colors, radius, spacing, typography } from '../theme';

const accountLinks: Array<{
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}> = [
  { id: 'orders', icon: 'cube-outline', label: 'My orders' },
  { id: 'wishlist', icon: 'heart-outline', label: 'Wishlist' },
  { id: 'addresses', icon: 'location-outline', label: 'Saved addresses' },
  { id: 'payment', icon: 'card-outline', label: 'Payment methods' },
  { id: 'help', icon: 'help-circle-outline', label: 'Help & support' },
];

export const AccountScreen = ({ navigation }: AccountScreenProps) => {
  const { user, signOut, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, phone });
      setEditing(false);
    } catch (e: any) {
      Alert.alert('Update failed', e?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const onLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.replace('Home');
        },
      },
    ]);
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={36} color={colors.text} />
          </View>
          <Text style={styles.heading}>{user?.name ?? 'Welcome'}</Text>
          <Text style={styles.subtitle}>{user?.email ?? ''}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PROFILE</Text>
            {!editing ? (
              <Pressable onPress={() => setEditing(true)}>
                <Text style={styles.linkText}>Edit</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setEditing(false);
                  setName(user?.name ?? '');
                  setPhone(user?.phone ?? '');
                }}
              >
                <Text style={styles.linkText}>Cancel</Text>
              </Pressable>
            )}
          </View>
          {editing ? (
            <View>
              <Text style={styles.label}>NAME</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.label}>PHONE</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
                placeholder="+92 ..."
                placeholderTextColor={colors.textMuted}
              />
              <Pressable
                style={[styles.primary, saving && styles.primaryDisabled]}
                onPress={onSave}
                disabled={saving}
              >
                <Text style={styles.primaryText}>
                  {saving ? 'SAVING…' : 'SAVE CHANGES'}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <InfoRow label="Name" value={user?.name} />
              <InfoRow label="Email" value={user?.email} />
              <InfoRow label="Phone" value={user?.phone || '—'} />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          {accountLinks.map((l) => (
            <Pressable
              key={l.id}
              style={styles.linkRow}
              onPress={() =>
                Alert.alert(l.label, 'This screen is coming soon.')
              }
            >
              <View style={styles.linkLeft}>
                <Ionicons name={l.icon} size={20} color={colors.text} />
                <Text style={styles.linkLabel}>{l.label}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.signOutBtn} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color={colors.sale} />
          <Text style={styles.signOutText}>SIGN OUT</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value ?? '—'}</Text>
  </View>
);

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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  avatarWrap: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heading: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 4,
  },
  section: { marginTop: spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.tiny,
    color: colors.text,
    letterSpacing: 3,
  },
  linkText: {
    ...typography.smallMed,
    color: colors.text,
    textDecorationLine: 'underline',
  },
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
  primary: {
    height: 50,
    backgroundColor: colors.text,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryDisabled: { opacity: 0.7 },
  primaryText: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
    fontSize: 13,
  },
  infoCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  infoLabel: { ...typography.small, color: colors.textMuted },
  infoValue: { ...typography.smallMed, color: colors.text },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  linkLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  linkLabel: { ...typography.body, color: colors.text },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.sale,
    borderRadius: radius.sm,
  },
  signOutText: {
    color: colors.sale,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
    fontSize: 12,
  },
});
