import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { featuredBrands } from '../data';
import { colors, radius, spacing, typography } from '../theme';

type LogoStyle = {
  fontFamily: string;
  fontStyle?: 'italic' | 'normal';
  letterSpacing?: number;
  fontSize?: number;
};

const logoStyles: Record<string, LogoStyle> = {
  'HUSSAIN REHAR': { fontFamily: 'PlayfairDisplay_700Bold', letterSpacing: 1, fontSize: 14 },
  'Mushq': { fontFamily: 'PlayfairDisplay_700Bold_Italic', fontStyle: 'italic', fontSize: 22 },
  'Sana Safinaz': { fontFamily: 'PlayfairDisplay_400Regular', letterSpacing: 1.5, fontSize: 14 },
  'J.': { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 28 },
  'Junaid Jamshed': { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 14 },
  'Manto': { fontFamily: 'PlayfairDisplay_700Bold', letterSpacing: 4, fontSize: 16 },
  'Ego': { fontFamily: 'PlayfairDisplay_700Bold_Italic', fontStyle: 'italic', fontSize: 24 },
  'Naya Dour': { fontFamily: 'PlayfairDisplay_400Regular', letterSpacing: 1, fontSize: 16 },
  'KOEL': { fontFamily: 'PlayfairDisplay_700Bold', letterSpacing: 6, fontSize: 18 },
  'TAANA BAANA': { fontFamily: 'PlayfairDisplay_400Regular', letterSpacing: 2, fontSize: 13 },
};

export const FeaturedBrands = () => {
  return (
    <View style={styles.grid}>
      {featuredBrands.map((b) => {
        const s = logoStyles[b.name] ?? {
          fontFamily: 'PlayfairDisplay_700Bold',
          fontSize: 16,
        };
        return (
          <Pressable key={b.id} style={styles.card}>
            <Text
              style={[styles.label, s]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {b.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  card: {
    flexBasis: '31.5%',
    flexGrow: 1,
    aspectRatio: 16 / 11,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  label: {
    color: colors.text,
    textAlign: 'center',
  },
});
