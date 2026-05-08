import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

const helpLinks = [
  'FAQs',
  'Contact Us',
  'Track Order',
  'Delivery, Return & Exchange Policy',
  'Terms & Conditions',
  'Privacy Policy',
];

const aboutLinks = ['About Us', 'Partner with Us'];

const socials: Array<keyof typeof Ionicons.glyphMap> = [
  'logo-instagram',
  'logo-facebook',
  'logo-tiktok',
  'logo-youtube',
  'logo-twitter',
];

export const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.wrapper}>
      <View style={styles.brandWrap}>
        <Text style={styles.brand}>ZARR</Text>
        <View style={styles.brandUnderline} />
        <Text style={styles.brandTag}>PAKISTAN'S FINEST FASHION</Text>
      </View>

      <View style={styles.newsletter}>
        <Text style={styles.newsletterLabel}>LET'S BE EMAIL FRIENDS</Text>
        <Text style={styles.newsletterSubtitle}>
          Exclusive deals, insider updates, and first looks at new drops.
          {'\n'}No clutter. Just curated goodness.
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor="#9A9A9A"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Pressable style={styles.signupBtn}>
            <Text style={styles.signupText}>SIGN UP</Text>
          </Pressable>
        </View>
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox} />
          <Text style={styles.checkboxLabel}>
            I agree to the Terms and Conditions.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HELP & INFORMATION</Text>
        {helpLinks.map((l) => (
          <Pressable key={l}>
            <Text style={styles.link}>{l}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT ZARR</Text>
        {aboutLinks.map((l) => (
          <Pressable key={l}>
            <Text style={styles.link}>{l}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FOLLOW US</Text>
        <View style={styles.socialRow}>
          {socials.map((s) => (
            <Pressable key={s} style={styles.socialBtn}>
              <Ionicons name={s} size={18} color={colors.white} />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.bottomBar}>
        <Text style={styles.copy}>© 2025 ZARR. All rights reserved.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.footerBg,
    paddingTop: spacing.xxl,
  },
  brandWrap: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  brand: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    letterSpacing: 8,
    color: colors.white,
  },
  brandUnderline: {
    marginTop: 4,
    width: 38,
    height: 1.5,
    backgroundColor: colors.white,
  },
  brandTag: {
    ...typography.tiny,
    color: '#BFBFBF',
    marginTop: spacing.sm,
    letterSpacing: 3,
  },
  newsletter: {
    backgroundColor: colors.newsletterBg,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  newsletterLabel: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 3,
    marginBottom: spacing.sm,
  },
  newsletterSubtitle: {
    ...typography.small,
    color: '#BBBBBB',
    lineHeight: 19,
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: '#262626',
    color: colors.white,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  signupBtn: {
    height: 44,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    ...typography.tiny,
    color: colors.text,
    letterSpacing: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#777',
  },
  checkboxLabel: {
    ...typography.small,
    color: '#9C9C9C',
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 3,
    marginBottom: spacing.sm,
  },
  link: {
    ...typography.body,
    color: '#BFBFBF',
    paddingVertical: spacing.xs,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  socialBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#333',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  copy: {
    ...typography.small,
    color: '#777',
  },
});
