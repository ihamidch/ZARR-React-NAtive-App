import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { featuredBrands } from '../data';
import { useBrands } from '../hooks/useProducts';
import { colors, radius, shadows, spacing, typography } from '../theme';

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

type Props = {
  onPress: (brandName: string) => void;
  limit?: number;
};

export const FeaturedBrands = ({ onPress, limit = 6 }: Props) => {
  const { data: allBrands = [] } = useBrands();

  const brands = useMemo(() => {
    return (allBrands || []).slice(0, limit);
  }, [allBrands, limit]);

  return (
    <View style={styles.grid}>
      {brands.map((b) => {
        const s = logoStyles[b.title] ?? {
          fontFamily: 'PlayfairDisplay_700Bold',
          fontSize: 16,
        };
        return (
          <Pressable
            key={b.id}
            style={({ pressed }) => [
              styles.card,
              pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => onPress(b.title)}
          >
            <Text
              style={[styles.label, s]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {b.title}
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
    paddingVertical: spacing.md,
    justifyContent: 'space-between',
  },
  card: {
    width: '31%', // Three items per row for a professional, condensed look
    aspectRatio: 1, // Square cards look more high-end for logos
    borderRadius: radius.md,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.text,
    textAlign: 'center',
  },
});
