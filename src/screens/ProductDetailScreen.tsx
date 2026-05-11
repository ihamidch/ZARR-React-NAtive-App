import React, { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
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
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [showSpecs, setShowSpecs] = useState(true);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 8);
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
  const sizes = product.sizes ?? [];

  const onAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      Alert.alert(
        'Please select a size',
        `Choose from ${sizes.join(', ')} before adding to cart.`,
      );
      return;
    }
    Alert.alert(
      'Added to cart',
      `${product.title}\n${selectedColor ?? ''}${
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
        <View style={styles.topTitleWrap}>
          <Text style={styles.brand}>ZARR</Text>
        </View>
        <View style={styles.topRight}>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="share-outline" size={22} color={colors.text} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="bag-outline" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Gallery */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(
                e.nativeEvent.contentOffset.x / WINDOW_WIDTH,
              );
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
                <Pressable style={styles.wishlistFloat}>
                  <Ionicons
                    name="heart-outline"
                    size={20}
                    color={colors.text}
                  />
                </Pressable>
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
        </View>

        {/* Title + price block */}
        <View style={styles.infoBlock}>
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
              <>
                <Text style={styles.originalPrice}>
                  {formatPrice(product.originalPrice)}
                </Text>
                <View style={styles.discountPill}>
                  <Text style={styles.discountPillText}>
                    -{product.discountPercent}%
                  </Text>
                </View>
              </>
            ) : null}
          </View>

          {product.taxIncluded ? (
            <Text style={styles.taxLine}>Tax included.</Text>
          ) : null}

          {/* Color */}
          {product.colors && product.colors.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.label}>
                COLOR:{' '}
                <Text style={styles.labelValue}>
                  {selectedColor ?? product.color ?? ''}
                </Text>
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

          {/* Size — dropdown like ZARR ('Please select') */}
          {sizes.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>SIZE:</Text>
                <Pressable>
                  <Text style={styles.sizeGuide}>Size guide</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.sizeSelect}
                onPress={() => setSizeModalOpen(true)}
              >
                <Text
                  style={[
                    styles.sizeSelectText,
                    !selectedSize && styles.sizeSelectPlaceholder,
                  ]}
                >
                  {selectedSize ?? `Please select ${sizes[0]}`}
                </Text>
                <Ionicons name="chevron-down" size={18} color={colors.text} />
              </Pressable>
            </View>
          ) : null}

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.label}>QUANTITY:</Text>
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

          {/* Specs table — exact ZARR layout */}
          {product.specs && product.specs.length > 0 ? (
            <View style={styles.specsWrap}>
              <Pressable
                style={styles.specsHeader}
                onPress={() => setShowSpecs((v) => !v)}
              >
                <Text style={styles.specsTitle}>PRODUCT DETAILS</Text>
                <Ionicons
                  name={showSpecs ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.text}
                />
              </Pressable>
              {showSpecs ? (
                <View style={styles.specsTable}>
                  {product.specs.map((s, i) => (
                    <View
                      key={s.label}
                      style={[
                        styles.specRow,
                        i === product.specs!.length - 1 && styles.specRowLast,
                      ]}
                    >
                      <Text style={styles.specLabel}>{s.label}:</Text>
                      <Text style={styles.specValue}>{s.value}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}

          {/* Description */}
          {product.description ? (
            <View style={styles.section}>
              <Text style={styles.label}>DESCRIPTION</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          ) : null}

          {/* Perks */}
          <View style={styles.perks}>
            {[
              {
                icon: 'cube-outline' as const,
                label: 'Free shipping over Rs. 5,000',
              },
              {
                icon: 'refresh-outline' as const,
                label: 'Easy 7-day returns',
              },
              {
                icon: 'shield-checkmark-outline' as const,
                label: 'Authenticity guaranteed',
              },
              {
                icon: 'cash-outline' as const,
                label: 'Cash on delivery available',
              },
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

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Sticky add-to-cart bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.heartBtnLarge}>
          <Ionicons name="heart-outline" size={22} color={colors.text} />
        </Pressable>
        <Pressable style={styles.addBtn} onPress={onAddToCart}>
          <Text style={styles.addBtnText}>
            ADD TO CART · {formatPrice(product.price * qty)}
          </Text>
        </Pressable>
      </View>

      {/* Size picker modal */}
      <Modal
        visible={sizeModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSizeModalOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSizeModalOpen(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select size</Text>
              <Pressable onPress={() => setSizeModalOpen(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>
            {sizes.map((s) => {
              const active = selectedSize === s;
              return (
                <Pressable
                  key={s}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedSize(s);
                    setSizeModalOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      active && styles.modalOptionTextActive,
                    ]}
                  >
                    {s}
                  </Text>
                  {active ? (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.text}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
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
  topTitleWrap: { flex: 1, alignItems: 'center' },
  brand: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    letterSpacing: 4,
    color: colors.text,
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
  wishlistFloat: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
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
  dotActive: { backgroundColor: colors.text, width: 18 },
  infoBlock: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 28,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: 4,
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
  discountPill: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  discountPillText: {
    ...typography.tiny,
    color: colors.accent,
    letterSpacing: 1,
  },
  taxLine: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  section: { marginTop: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.tiny,
    color: colors.text,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  labelValue: {
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0,
    textTransform: 'none',
    color: colors.textMuted,
  },
  sizeGuide: {
    ...typography.small,
    color: colors.text,
    textDecorationLine: 'underline',
  },
  sizeSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
  },
  sizeSelectText: { ...typography.body, color: colors.text },
  sizeSelectPlaceholder: { color: colors.textMuted },
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
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
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
  specsWrap: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  specsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  specsTitle: { ...typography.tiny, color: colors.text, letterSpacing: 2 },
  specsTable: { backgroundColor: colors.white },
  specRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  specRowLast: { borderBottomWidth: 0 },
  specLabel: {
    ...typography.smallMed,
    color: colors.text,
    flex: 0.4,
  },
  specValue: { ...typography.small, color: colors.textMuted, flex: 0.6 },
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
  relatedRow: { paddingHorizontal: spacing.lg, gap: spacing.md },
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: colors.text,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  modalOptionText: { ...typography.body, color: colors.text },
  modalOptionTextActive: {
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
});
