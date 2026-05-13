import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  allProducts as mockAllProducts,
  formatPrice,
  getCollectionById,
} from '../data';
import { ProductCard } from '../components/ProductCard';
import { Footer } from '../components/Footer';
import { useProduct } from '../hooks/useProducts';
import { useAuth } from '../context/AuthContext';
import type { ProductDetailScreenProps } from '../types/navigation';
import { colors, radius, spacing, typography } from '../theme';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

const skuFromProductId = (id: string) => {
  const digits = id.replace(/\D/g, '').padStart(3, '0').slice(0, 3);
  const letters = id.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3) || 'ZAR';
  return `N${digits}-002-${letters}`;
};

export const ProductDetailScreen = ({
  route,
  navigation,
}: ProductDetailScreenProps) => {
  const { productId } = route.params;
  const { data: product, status, refresh, source } = useProduct(productId);
  const { isAuthenticated } = useAuth();

  const collection = product?.collectionId
    ? getCollectionById(product.collectionId)
    : undefined;
  const brand = product?.brand ?? collection?.brand;

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined,
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0]);
      setSelectedColor(product.colors?.[0]?.name);
    }
  }, [product]);

  const [qty, setQty] = useState(1);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const related = useMemo(() => {
    if (!product) return [];
    return mockAllProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 8);
  }, [product]);

  const recentlyViewed = useMemo(() => {
    if (!product) return [];
    return mockAllProducts
      .filter((p) => p.id !== product.id)
      .slice(-6)
      .reverse();
  }, [product]);


  const gallery = product?.gallery ?? (product ? [product.image] : []);
  const sizes = product?.sizes ?? [];
  const sku = product ? skuFromProductId(product.id) : '';
  const skuSuffix = sizes[0]?.toLowerCase().includes('piece') ? '(3-PCS)' : '';

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
      `${product?.title || 'Product'}\n${selectedColor ?? ''}${
        selectedSize ? ' · ' + selectedSize : ''
      } · Qty ${qty}`,
    );
  };

  const onBuyNow = () => {
    if (sizes.length > 0 && !selectedSize) {
      Alert.alert('Please select a size', 'Choose a size to continue.');
      return;
    }
    Alert.alert('Buy it now', `Proceed to checkout for ${product?.title || 'Product'}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.topTitleWrap}>
          <Text style={styles.brandLogo}>ZARR</Text>
          <View style={styles.brandLogoUnderline} />
        </View>
        <View style={styles.topRight}>
          <Pressable
            style={styles.iconBtn}
            onPress={() =>
              isAuthenticated
                ? navigation.navigate('Account')
                : navigation.navigate('Login')
            }
          >
            <Ionicons
              name={isAuthenticated ? 'person' : 'person-outline'}
              size={22}
              color={colors.text}
            />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="bag-outline" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>

      {status === 'loading' && !product ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={colors.text} size="large" />
        </View>
      ) : !product ? (
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Product not found.</Text>
          <Pressable onPress={() => navigation.goBack()} style={styles.backCta}>
            <Text style={styles.backCtaText}>GO BACK</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={status === 'loading'}
              onRefresh={refresh}
              tintColor={colors.text}
            />
          }
        >
        {/* Single hero image (swipeable gallery if multiple) */}
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
                <Pressable
                  style={styles.wishlistFloat}
                  onPress={() => setWishlisted((v) => !v)}
                >
                  <Ionicons
                    name={wishlisted ? 'heart' : 'heart-outline'}
                    size={20}
                    color={wishlisted ? colors.accent : colors.text}
                  />
                </Pressable>
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
          {gallery.length > 1 ? (
            <View style={styles.dotsRow}>
              {gallery.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === activeImage && styles.dotActive]}
                />
              ))}
            </View>
          ) : null}
        </View>

        {/* Product info block */}
        <View style={styles.infoBlock}>
          {brand ? <Text style={styles.brandWordmark}>{brand}</Text> : null}
          <Text style={styles.sku}>
            {sku}
            {skuSuffix ? ` ${skuSuffix}` : ''}
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

          {sizes.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.label}>SIZE</Text>
              <Pressable
                style={styles.sizeSelect}
                onPress={() => setSizeModalOpen(true)}
              >
                <Text style={styles.sizeSelectText}>
                  {(selectedSize ?? sizes[0]).toUpperCase()}
                </Text>
                <Ionicons name="chevron-down" size={18} color={colors.text} />
              </Pressable>
            </View>
          ) : null}

          <View style={styles.section}>
            <View style={styles.qtyAndAddRow}>
              <View style={styles.qtyBox}>
                <Pressable
                  style={styles.qtyBtn}
                  onPress={() => setQty((q) => Math.max(1, q - 1))}
                  hitSlop={8}
                >
                  <Ionicons name="remove" size={16} color={colors.text} />
                </Pressable>
                <Text style={styles.qtyValue}>{qty}</Text>
                <Pressable
                  style={styles.qtyBtn}
                  onPress={() => setQty((q) => q + 1)}
                  hitSlop={8}
                >
                  <Ionicons name="add" size={16} color={colors.text} />
                </Pressable>
              </View>
              <Pressable
                style={styles.addBtnInline}
                onPress={onAddToCart}
              >
                <Text style={styles.addBtnInlineText}>ADD TO CART</Text>
              </Pressable>
            </View>

            <Pressable style={styles.buyNowBtn} onPress={onBuyNow}>
              <Text style={styles.buyNowText}>Buy it now</Text>
            </Pressable>
          </View>

          {product.description ? (
            <Text style={styles.description}>{product.description}</Text>
          ) : null}

          {product.specs && product.specs.length > 0 ? (
            <View style={styles.specsList}>
              {product.specs.map((s) => (
                <View key={s.label} style={styles.specBullet}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.specText}>
                    <Text style={styles.specLabelInline}>{s.label}:</Text>{' '}
                    {s.value}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {related.length > 0 ? (
          <View style={styles.relatedWrap}>
            <Text style={styles.relatedTitle}>More For You</Text>
            <View style={styles.relatedDivider} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedRow}
            >
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  width={160}
                  brand={brand}
                  onPress={() =>
                    navigation.push('ProductDetail', { productId: p.id })
                  }
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {recentlyViewed.length > 0 ? (
          <View style={styles.relatedWrap}>
            <Text style={styles.relatedTitle}>Recently Viewed</Text>
            <View style={styles.relatedDivider} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedRow}
            >
              {recentlyViewed.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  width={160}
                  brand={brand}
                  onPress={() =>
                    navigation.push('ProductDetail', { productId: p.id })
                  }
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        <Footer />
      </ScrollView>
      )}

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
  brandLogo: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    letterSpacing: 4,
    color: colors.text,
  },
  brandLogoUnderline: {
    width: 28,
    height: 1.5,
    backgroundColor: colors.text,
    marginTop: 3,
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
  infoBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  brandWordmark: {
    fontFamily: 'PlayfairDisplay_700Bold_Italic',
    fontSize: 22,
    color: colors.text,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  sku: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 24,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: 2,
    justifyContent: 'center',
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
    marginTop: 4,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  section: { marginTop: spacing.lg },
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
  sizeSelectText: {
    ...typography.smallMed,
    color: colors.text,
    letterSpacing: 1,
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
  qtyAndAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: colors.text,
    minWidth: 22,
    textAlign: 'center',
  },
  addBtnInline: {
    flex: 1,
    height: 48,
    backgroundColor: colors.text,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnInlineText: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.5,
    fontSize: 12,
  },
  buyNowBtn: {
    marginTop: spacing.md,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.text,
    alignSelf: 'center',
  },
  buyNowText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.text,
    letterSpacing: 0.5,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  specsList: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  specBullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text,
    marginTop: 9,
  },
  specText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  specLabelInline: {
    fontFamily: 'Inter_600SemiBold',
  },
  relatedWrap: {
    marginTop: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  relatedTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  relatedDivider: {
    width: 30,
    height: 1.5,
    backgroundColor: colors.text,
    alignSelf: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  relatedRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
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
