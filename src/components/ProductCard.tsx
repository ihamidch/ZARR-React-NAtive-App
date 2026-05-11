import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../data';
import type { Product } from '../types';
import { colors, radius, spacing, typography } from '../theme';

type Props = {
  product: Product;
  width?: number;
  onPress?: () => void;
};

export const ProductCard = ({ product, width = 170, onPress }: Props) => {
  const { title, price, originalPrice, discountPercent, image } = product;
  return (
    <Pressable style={[styles.card, { width }]} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: image }} style={styles.image} />
        {discountPercent ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>-{discountPercent}%</Text>
          </View>
        ) : null}
        <Pressable style={styles.heartBtn} hitSlop={8}>
          <Ionicons name="heart-outline" size={16} color={colors.text} />
        </Pressable>
      </View>
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
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.text,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  heartBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  title: {
    ...typography.smallMed,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    minHeight: 36,
    lineHeight: 17,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  price: {
    ...typography.h3,
    color: colors.text,
  },
  priceSale: {
    color: colors.accent,
  },
  originalPrice: {
    ...typography.small,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
});
