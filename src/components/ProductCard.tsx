import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../data';
import type { Product } from '../types';
import { colors, radius, shadows, spacing, typography } from '../theme';

type Props = {
  product: Product;
  width?: number;
  onPress?: () => void;
  brand?: string;
};

export const ProductCard = ({ product, width = 170, onPress, brand }: Props) => {
  const { title, price, originalPrice, discountPercent, image, type } = product;
  const brandLabel = brand ?? product.brand;
  const [liked, setLiked] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (v: number) =>
    Animated.spring(scale, {
      toValue: v,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();

  return (
    <Animated.View style={[styles.outer, { width, transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        style={styles.card}
      >
        <View style={styles.imageWrap}>
          <Image source={{ uri: image }} style={styles.image} />

          {/* Subtle bottom-up shading so badge / heart stay readable on any photo */}
          <View style={styles.imageShade} />

          {discountPercent ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>−{discountPercent}%</Text>
            </View>
          ) : null}

          {/* Discreet type chip at the bottom-left of the image so customers
              instantly see what kind of item it is (Accessories, Western,
              Loungewear, etc.) without it being confused with the brand. */}
          {type ? (
            <View style={styles.typeChip}>
              <Text style={styles.typeChipText} numberOfLines={1}>
                {type.toUpperCase()}
              </Text>
            </View>
          ) : null}

          <Pressable
            style={styles.heartBtn}
            hitSlop={10}
            onPress={() => setLiked((v) => !v)}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={16}
              color={liked ? colors.accent : colors.text}
            />
          </Pressable>
        </View>

        <View style={styles.meta}>
          {brandLabel ? (
            <Text style={styles.brand} numberOfLines={1}>
              {brandLabel}
            </Text>
          ) : null}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, !!originalPrice && styles.priceSale]}>
              {formatPrice(price)}
            </Text>
            {originalPrice ? (
              <Text style={styles.originalPrice}>
                {formatPrice(originalPrice)}
              </Text>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outer: {
    // Animated wrapper so the press scale doesn't collapse the card hit area.
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.soft,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 3 / 4, // 3:4 for luxury fashion
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.05)', // Even softer shade
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.black, // Sleek black badge
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.6,
  },
  typeChip: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: '70%',
  },
  typeChipText: {
    color: colors.text,
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.4,
  },
  heartBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    ...shadows.soft,
  },
  meta: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  brand: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    color: colors.text,
    fontSize: 14,
    minHeight: 40,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  price: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    fontSize: 14,
  },
  priceSale: {
    color: colors.sale, // Distinct sale color
  },
  originalPrice: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
});
