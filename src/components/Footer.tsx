import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === section ? null : section);
  };

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

      {/* HELP SECTION */}
      <View style={styles.section}>
        <Pressable 
          style={styles.accordionHeader} 
          onPress={() => toggleSection('help')}
        >
          <Text style={styles.sectionTitle}>HELP & INFORMATION</Text>
          <Ionicons 
            name={expandedSection === 'help' ? "remove" : "add"} 
            size={20} 
            color={colors.white} 
          />
        </Pressable>
        
        {expandedSection === 'help' && (
          <View style={styles.accordionContent}>
            {helpLinks.map((l) => (
              <Pressable 
                key={l}
                onPress={() => {
                  if (l === 'FAQs') {
                    Linking.openURL('https://zarr.com.pk/');
                  }
                }}
              >
                <Text style={styles.link}>{l}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* ABOUT SECTION */}
      <View style={styles.section}>
        <Pressable 
          style={styles.accordionHeader} 
          onPress={() => toggleSection('about')}
        >
          <Text style={styles.sectionTitle}>ABOUT ZARR</Text>
          <Ionicons 
            name={expandedSection === 'about' ? "remove" : "add"} 
            size={20} 
            color={colors.white} 
          />
        </Pressable>

        {expandedSection === 'about' && (
          <View style={styles.accordionContent}>
            {aboutLinks.map((l) => (
              <Pressable key={l}>
                <Text style={styles.link}>{l}</Text>
              </Pressable>
            ))}
          </View>
        )}
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
    backgroundColor: '#000000', // Black footer
    paddingTop: spacing.xxl,
  },
  brandWrap: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  brand: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    letterSpacing: 8,
    color: colors.white,
  },
  brandUnderline: {
    marginTop: 6,
    width: 40,
    height: 1,
    backgroundColor: colors.white,
  },
  brandTag: {
    ...typography.tiny,
    color: '#999999',
    marginTop: spacing.sm,
    letterSpacing: 4,
  },
  newsletter: {
    backgroundColor: '#111111',
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.md,
  },
  newsletterLabel: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 3,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  newsletterSubtitle: {
    ...typography.small,
    color: '#AAAAAA',
    lineHeight: 18,
    marginBottom: spacing.md,
    textAlign: 'center',
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
    backgroundColor: '#222222',
    borderWidth: 1,
    borderColor: '#333333',
    color: colors.white,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  signupBtn: {
    height: 44,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: colors.black,
    letterSpacing: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#555555',
  },
  checkboxLabel: {
    ...typography.tiny,
    color: '#888888',
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#222222', 
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  accordionContent: {
    marginTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 3,
  },
  link: {
    ...typography.small,
    color: '#AAAAAA',
    paddingVertical: spacing.sm,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  socialBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  copy: {
    ...typography.tiny,
    color: '#666666',
    letterSpacing: 1,
  },
});