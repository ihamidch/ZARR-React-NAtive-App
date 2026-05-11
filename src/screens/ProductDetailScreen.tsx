import React, { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { allProducts, formatPrice, getProductById } from '../data';
import { ProductCard } from '../components/ProductCard';
import type { ProductDetailScreenProps } from '../types/navigation';
import { colors, radius, spacing, typography } from '../theme';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

export const ProductDetailScreen = ({
  route,
  navigation,
}: ProductDetailScreenProps) => {
  const { productId } = route.params;
  const product = getProductById(productId);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0]?.name,
  );
  const [qty, setQty] = useState(1);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 6);
  }, [product]);

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Product not found.</Text>
          <Pressable onPress={() => navigation.goBack()} style={styles.backCta}>
            <Text style={styles.backCtaText}>GO BACK</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const gallery = product.gallery ?? [product.image];

  const onAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      Alert.alert('Select a size', 'Please choose a size before adding to cart.');
      return;
    }
    Alert.alert(
      'Added to bag',
      `${product.title} · ${selectedColor ?? ''}${
        selectedSize ? ' · ' + selectedSize : ''
      } · Qty ${qty}`,
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {product.title}
        </Text>
        <View style={styles.topRight}>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="heart-outline" size={22} color={colors.text} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="bag-outline" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / WINDOW_WIDTH);
            setActiveImage(idx);
          }}
        >
          {gallery.map((uri, i) => (
            <View key={i} style={styles.heroImageWrap}>
              <Image source={{ uri }} style={styles.heroImage} />
              {product.discountPercent ? (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>
                    -{product.discountPercent}%
                  </Text>
                </View>
              ) : null}
            </View>
          ))}
        </ScrollView>
        <View style={styles.dotsRow}>
          {gallery.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeImage && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.category}>
            {product.category === 'women' ? "WOMEN'S COLLECTION" : "MEN'S COLLECTION"}
          </Text>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.priceRow}>
            <Text
              style={[
                styles.price,
                product.originalPrice ? { color: colors.accent } : null,
              ]}
            >
              {formatPrice(product.price)}
            </Text>
            {product.originalPrice ? (
              <Text style={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </Text>
            ) : null}
            {product.discountPercent ? (
              <View style={styles.savePill}>
                <Text style={styles.savePillText}>
                  SAVE {product.discountPercent}%
                </Text>
              </View>
            ) : null}
          </View>

          {product.colors && product.colors.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Color{selectedColor ? `: ${selectedColor}` : ''}
              </Text>
              <View style={styles.swatchRow}>
                {product.colors.map((c) => {
                  const active = selectedColor === c.name;
                  return (
                    <Pressable
                      key={c.name}
                      style={[styles.swatch, active && styles.swatchActive]}
                      onPress={() => setSelectedColor(c.name)}
                    >
                      <View
                        style={[styles.swatchDot, { backgroundColor: c.hex }]}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          {product.sizes && product.sizes.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Select size</Text>
                <Pressable>
                  <Text style={styles.sizeGuide}>Size guide</Text>
                </Pressable>
              </View>
              <View style={styles.sizeRow}>
                {product.sizes.map((s) => {
                  const active = selectedSize === s;
                  return (
                    <Pressable
                      key={s}
                      style={[styles.sizeChip, active && styles.sizeChipActive]}
                      onPress={() => setSelectedSize(s)}
                    >
                      <Text
                        style={[
                          styles.sizeText,
                          active && styles.sizeTextActive,
                        ]}
                      >
                        {s}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.qtyRow}>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={16} color={colors.text} />
              </Pressable>
              <Text style={styles.qtyValue}>{qty}</Text>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => setQty((q) => q + 1)}
              >
                <Ionicons name="add" size={16} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.perks}>
            {[
              { icon: 'cube-outline' as const, label: 'Free shipping over Rs. 5,000' },
              { icon: 'refresh-outline' as const, label: 'Easy 7-day returns' },
              { icon: 'shield-checkmark-outline' as const, label: 'Authenticity guaranteed' },
            ].map((p) => (
              <View key={p.label} style={styles.perkRow}>
                <Ionicons name={p.icon} size={18} color={colors.text} />
                <Text style={styles.perkText}>{p.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {related.length > 0 ? (
          <View style={styles.relatedWrap}>
            <Text style={styles.relatedTitle}>You may also like</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedRow}
            >
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  width={150}
                  onPress={() =>
                    navigation.push('ProductDetail', { productId: p.id })
                  }
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.heartBtnLarge}>
          <Ionicons name="heart-outline" size={22} color={colors.text} />
        </Pressable>
        <Pressable style={styles.addBtn} onPress={onAddToCart}>
          <Text style={styles.addBtnText}>ADD TO BAG · {formatPrice(product.price * qty)}</Text>
        </Pressable>
      </View>
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
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    flex: 1,
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  topRight: { flexDirection: 'row' },
  heroImageWrap: {
    width: WINDOW_WIDTH,
    aspectRatio: 3 / 4,
    backgroundColor: colors.surfaceAlt,
  },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  discountBadge: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    backgroundColor: colors.text,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  discountBadgeText: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.divider,
  },
  dotActive: {
    backgroundColor: colors.text,
    width: 18,
  },
  infoBlock: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  category: {
    ...typography.tiny,
    color: colors.textMuted,
    letterSpacing: 3,
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 28,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  price: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: colors.text,
  },
  originalPrice: {
    ...typography.body,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  savePill: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  savePillText: {
    ...typography.tiny,
    color: colors.accent,
    letterSpacing: 1,
  },
  section: { marginTop: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.smallMed,
    color: colors.text,
    letterSpacing: 1,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  sizeGuide: {
    ...typography.small,
    color: colors.text,
    textDecorationLine: 'underline',
  },
  swatchRow: { flexDirection: 'row', gap: spacing.sm },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  swatchActive: { borderColor: colors.text },
  swatchDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  sizeRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  sizeChip: {
    minWidth: 50,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  sizeChipActive: {
    borderColor: colors.text,
    backgroundColor: colors.text,
  },
  sizeText: {
    ...typography.smallMed,
    color: colors.text,
    letterSpacing: 1,
  },
  sizeTextActive: { color: colors.white },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    ...typography.h3,
    color: colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
  perks: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  perkText: { ...typography.smallMed, color: colors.text },
  relatedWrap: {
    marginTop: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
  },
  relatedTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  relatedRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  heartBtnLarge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  addBtn: {
    flex: 1,
    height: 50,
    backgroundColor: colors.text,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  addBtnText: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.5,
    fontSize: 13,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  notFoundText: { ...typography.body, color: colors.textMuted },
  backCta: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.text,
    borderRadius: radius.pill,
  },
  backCtaText: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.5,
  },
});
