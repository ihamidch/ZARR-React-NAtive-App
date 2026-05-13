import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCategoryShortcuts } from '../hooks/useProducts';
import { colors, radius, shadows, spacing, typography } from '../theme';

type Props = {
  onPress?: (handle: string, label: string) => void;
};

// Small fallback icons mapped to category labels for when the live image
// hasn't loaded yet (or in case a future store has a type with no image).
const FALLBACK_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  women: 'woman-outline',
  men: 'man-outline',
  accessories: 'glasses-outline',
  eastern: 'flower-outline',
  western: 'shirt-outline',
  lawn: 'leaf-outline',
  modestwear: 'shield-checkmark-outline',
  loungewear: 'bed-outline',
  kids: 'happy-outline',
  beauty: 'sparkles-outline',
  dresses: 'shirt-outline',
  dupattas: 'flower-outline',
  sale: 'pricetag-outline',
};

export const ShopByType = ({ onPress }: Props) => {
  const { data, status } = useCategoryShortcuts();

  if (status === 'loading' && !data.length) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.text} size="small" />
      </View>
    );
  }

  if (!data.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {data.map((type) => {
        const iconName = FALLBACK_ICONS[type.id] || 'pricetag-outline';
        return (
          <Pressable
            key={type.id}
            onPress={() => onPress?.(type.handle, type.label)}
            style={({ pressed }) => [
              styles.item,
              pressed && { transform: [{ scale: 0.94 }] },
            ]}
          >
            <View style={styles.imageWrap}>
              {type.image ? (
                <Image source={{ uri: type.image }} style={styles.image} />
              ) : (
                <View style={styles.imageFallback}>
                  <Ionicons name={iconName} size={26} color={colors.gold} />
                </View>
              )}
              {/* Soft inner ring for premium feel */}
              <View style={styles.ring} />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {type.label}
            </Text>
            {typeof type.productsCount === 'number' && type.productsCount > 0 ? (
              <Text style={styles.count} numberOfLines={1}>
                {type.productsCount > 999
                  ? `${(type.productsCount / 1000).toFixed(1)}k`
                  : type.productsCount}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const ITEM_SIZE = 76;

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  loading: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  item: {
    width: ITEM_SIZE + 8,
    alignItems: 'center',
  },
  imageWrap: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ITEM_SIZE / 2,
    borderWidth: 1.5,
    borderColor: 'rgba(182,138,92,0.35)',
  },
  label: {
    ...typography.smallMed,
    color: colors.text,
    marginTop: 6,
    fontSize: 11,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  count: {
    ...typography.tiny,
    color: colors.textMuted,
    fontSize: 9,
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
