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
                <>
                  <Image source={{ uri: type.image }} style={styles.image} />
                  {/* Subtle tint to de-emphasize cut-off text in banners */}
                  <View style={styles.imageTint} />
                </>
              ) : (
                <View style={styles.imageFallback}>
                  <Ionicons name={iconName} size={26} color={colors.gold} />
                </View>
              )}
              <View style={styles.ring} />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {type.label}
            </Text>
            {typeof type.productsCount === 'number' && type.productsCount > 0 ? (
              <Text style={styles.count} numberOfLines={1}>
                {type.productsCount > 999
                  ? `${(type.productsCount / 1000).toFixed(1)}k`
                  : type.productsCount} items
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const ITEM_SIZE = 76; // Slightly smaller for more refined look

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  loading: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  item: {
    width: ITEM_SIZE + 12,
    alignItems: 'center',
  },
  imageWrap: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadows.soft,
    marginBottom: spacing.sm,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
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
    borderWidth: 1,
    borderColor: colors.borderStrong, // More subtle elegant ring
  },
  label: {
    fontFamily: 'Inter_500Medium',
    color: colors.text,
    fontSize: 11,
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase', // Fashion standard uppercase
  },
  count: {
    ...typography.tiny,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 2,
    opacity: 0.8,
  },
});
