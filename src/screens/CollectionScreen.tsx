import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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
import { ProductCard } from '../components/ProductCard';
import { Footer } from '../components/Footer';
import { useCollectionProducts } from '../hooks/useProducts';
import type { CollectionScreenProps } from '../types/navigation';
import { colors, radius, spacing, typography } from '../theme';

type SortKey =
  | 'featured'
  | 'relevant'
  | 'bestSelling'
  | 'azA'
  | 'azZ'
  | 'priceLow'
  | 'priceHigh'
  | 'dateOld'
  | 'dateNew';

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'relevant', label: 'Most relevant' },
  { id: 'bestSelling', label: 'Best selling' },
  { id: 'azA', label: 'Alphabetically, A-Z' },
  { id: 'azZ', label: 'Alphabetically, Z-A' },
  { id: 'priceLow', label: 'Price, low to high' },
  { id: 'priceHigh', label: 'Price, high to low' },
  { id: 'dateOld', label: 'Date, old to new' },
  { id: 'dateNew', label: 'Date, new to old' },
];

const FILTER_GROUPS = [
  {
    id: 'gender',
    label: 'Category',
    options: ['All', 'Women', 'Men'],
  },
  {
    id: 'availability',
    label: 'Availability',
    options: ['All', 'In stock', 'On sale'],
  },
  {
    id: 'price',
    label: 'Price',
    options: ['All', 'Under Rs. 5,000', 'Rs. 5,000 – 15,000', 'Above Rs. 15,000'],
  },
];

export const CollectionScreen = ({
  route,
  navigation,
}: CollectionScreenProps) => {
  const { collectionId, title } = route.params;
  const isCategory = ['women', 'men', 'kids'].includes(collectionId);

  const {
    data: { products: dynamicProducts, collection },
    status,
    source,
    refresh,
    error,
  } = useCollectionProducts(collectionId, isCategory);

  const [sort, setSort] = useState<SortKey>('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<string>('All');

  const filteredProducts = useMemo(() => {
    let list = dynamicProducts;

    if (genderFilter === 'Women')
      list = list.filter((p) => p.category === 'women');
    if (genderFilter === 'Men')
      list = list.filter((p) => p.category === 'men');

    if (availabilityFilter === 'On sale')
      list = list.filter((p) => !!p.discountPercent);
    if (availabilityFilter === 'In stock')
      list = list.filter((p) => p.inStock !== false);

    if (priceFilter === 'Under Rs. 5,000')
      list = list.filter((p) => p.price < 5000);
    if (priceFilter === 'Rs. 5,000 – 15,000')
      list = list.filter((p) => p.price >= 5000 && p.price <= 15000);
    if (priceFilter === 'Above Rs. 15,000')
      list = list.filter((p) => p.price > 15000);

    if (sort === 'priceLow') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'priceHigh')
      list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'azA')
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'azZ')
      list = [...list].sort((a, b) => b.title.localeCompare(a.title));
    if (sort === 'dateNew') list = [...list].reverse();
    if (sort === 'bestSelling')
      list = [...list].sort(
        (a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0),
      );

    return list;
  }, [
    dynamicProducts,
    genderFilter,
    availabilityFilter,
    priceFilter,
    sort,
  ]);

  const activeFilterCount =
    (genderFilter !== 'All' ? 1 : 0) +
    (availabilityFilter !== 'All' ? 1 : 0) +
    (priceFilter !== 'All' ? 1 : 0);

  const clearAllFilters = () => {
    setGenderFilter('All');
    setAvailabilityFilter('All');
    setPriceFilter('All');
  };

  const brandWordmark = collection?.brand;
  const bannerUri = collection?.bannerImage ?? collection?.image;
  const sortLabel = SORTS.find((s) => s.id === sort)?.label ?? 'Featured';

  const ListHeader = (
    <View>
      {source === 'mock' && error ? (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>
            Showing offline preview — connect the backend to fetch live
            products.
          </Text>
        </View>
      ) : null}
      {bannerUri ? (
        <Image
          source={{ uri: bannerUri }}
          style={styles.banner}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.brandHeader}>
        {brandWordmark ? (
          <>
            <Text style={styles.brandWordmark}>{brandWordmark}</Text>
            <View style={styles.brandUnderline} />
          </>
        ) : (
          <>
            <Text style={styles.brandWordmark}>{title}</Text>
            <View style={styles.brandUnderline} />
          </>
        )}
        {collection?.description ? (
          <Text style={styles.description}>{collection.description}</Text>
        ) : null}
      </View>

      <View style={styles.filterBar}>
        <Pressable style={styles.filterBtn} onPress={() => setFilterOpen(true)}>
          <Text style={styles.filterBtnText}>Filter</Text>
          <Ionicons name="chevron-down" size={14} color={colors.text} />
          {activeFilterCount > 0 ? (
            <View style={styles.filterCountBadge}>
              <Text style={styles.filterCountBadgeText}>
                {activeFilterCount}
              </Text>
            </View>
          ) : null}
        </Pressable>
        <View style={styles.divider} />
        <Pressable
          style={styles.sortBtn}
          onPress={() => setSortOpen((v) => !v)}
        >
          <Text style={styles.sortLabel}>Sort by:</Text>
          <Text style={styles.sortText} numberOfLines={1}>
            {sortLabel}
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.text} />
        </Pressable>
      </View>

      {activeFilterCount > 0 ? (
        <View style={styles.countBar}>
          <Text style={styles.countText}>
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'product' : 'products'}
          </Text>
          <Pressable onPress={clearAllFilters}>
            <Text style={styles.clearText}>Clear all</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ height: spacing.sm }} />
      )}
    </View>
  );

  const ListEmpty = (
    <View style={styles.empty}>
      <Ionicons name="cube-outline" size={42} color={colors.textMuted} />
      <Text style={styles.emptyText}>No products match your filters.</Text>
      <Pressable onPress={clearAllFilters} style={styles.emptyCta}>
        <Text style={styles.emptyCtaText}>CLEAR FILTERS</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>ZARR</Text>
          <View style={styles.underline} />
        </View>
        <View style={styles.topRight}>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="search-outline" size={22} color={colors.text} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="bag-outline" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          status === 'loading' && dynamicProducts.length === 0 ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={colors.text} size="large" />
              <Text style={styles.loadingStateText}>Loading products…</Text>
            </View>
          ) : (
            ListEmpty
          )
        }
        ListFooterComponent={<Footer />}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading' && dynamicProducts.length > 0}
            onRefresh={refresh}
            tintColor={colors.text}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <ProductCard
              product={item}
              width={undefined as unknown as number}
              brand={brandWordmark}
              onPress={() =>
                navigation.navigate('ProductDetail', { productId: item.id })
              }
            />
          </View>
        )}
      />



      {/* Sort modal */}
      <Modal
        visible={sortOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSortOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSortOpen(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort by</Text>
              <Pressable onPress={() => setSortOpen(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView>
              {SORTS.map((s) => {
                const active = sort === s.id;
                return (
                  <Pressable
                    key={s.id}
                    style={styles.modalOption}
                    onPress={() => {
                      setSort(s.id);
                      setSortOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        active && styles.modalOptionTextActive,
                      ]}
                    >
                      {s.label}
                    </Text>
                    {active ? (
                      <Ionicons name="checkmark" size={20} color={colors.text} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Filter modal — bottom sheet with grouped options */}
      <Modal
        visible={filterOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setFilterOpen(false)}
        >
          <Pressable style={styles.modalSheetLarge} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Products</Text>
              <Pressable onPress={() => setFilterOpen(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView>
              <FilterGroup
                label="Category"
                value={genderFilter}
                options={FILTER_GROUPS[0].options}
                onChange={setGenderFilter}
              />
              <FilterGroup
                label="Availability"
                value={availabilityFilter}
                options={FILTER_GROUPS[1].options}
                onChange={setAvailabilityFilter}
              />
              <FilterGroup
                label="Price"
                value={priceFilter}
                options={FILTER_GROUPS[2].options}
                onChange={setPriceFilter}
              />
            </ScrollView>
            <View style={styles.modalFooter}>
              <Pressable
                style={[styles.modalFooterBtn, styles.modalFooterBtnGhost]}
                onPress={clearAllFilters}
              >
                <Text style={styles.modalFooterTextGhost}>CLEAR</Text>
              </Pressable>
              <Pressable
                style={[styles.modalFooterBtn, styles.modalFooterBtnPrimary]}
                onPress={() => setFilterOpen(false)}
              >
                <Text style={styles.modalFooterTextPrimary}>
                  SHOW {filteredProducts.length} RESULTS
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

type FilterGroupProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
};

const FilterGroup = ({ label, value, options, onChange }: FilterGroupProps) => (
  <View style={styles.filterGroup}>
    <Text style={styles.filterGroupLabel}>{label}</Text>
    {options.map((o) => {
      const active = value === o;
      return (
        <Pressable
          key={o}
          style={styles.filterOption}
          onPress={() => onChange(o)}
        >
          <View
            style={[
              styles.radioOuter,
              active && styles.radioOuterActive,
            ]}
          >
            {active ? <View style={styles.radioInner} /> : null}
          </View>
          <Text
            style={[
              styles.filterOptionText,
              active && styles.filterOptionTextActive,
            ]}
          >
            {o}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 56,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { flex: 1, alignItems: 'center' },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: colors.text,
    letterSpacing: 1,
  },
  underline: {
    width: 32,
    height: 1.5,
    backgroundColor: colors.text,
    marginTop: 4,
  },
  topRight: { flexDirection: 'row' },
  banner: {
    width: '100%',
    height: 220,
    backgroundColor: colors.surfaceAlt,
  },
  brandHeader: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  brandWordmark: {
    fontFamily: 'PlayfairDisplay_700Bold_Italic',
    fontSize: 34,
    letterSpacing: 4,
    color: colors.text,
    textAlign: 'center',
  },
  brandUnderline: {
    width: 44,
    height: 1.5,
    backgroundColor: colors.text,
    marginTop: spacing.sm,
  },
  description: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: spacing.md,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  filterBtnText: { ...typography.smallMed, color: colors.text },
  filterCountBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  filterCountBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: colors.white,
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: colors.border,
  },
  sortBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  sortLabel: { ...typography.small, color: colors.textMuted },
  sortText: { ...typography.smallMed, color: colors.text, maxWidth: 140 },
  countBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  countText: { ...typography.smallMed, color: colors.textMuted },
  clearText: {
    ...typography.small,
    color: colors.text,
    textDecorationLine: 'underline',
  },
  gridContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },
  gridRow: { gap: spacing.md, marginBottom: spacing.md },
  gridItem: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  emptyText: { ...typography.body, color: colors.textMuted },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  loadingStateText: { ...typography.small, color: colors.textMuted },
  offlineBanner: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  offlineBannerText: {
    ...typography.small,
    color: colors.text,
    textAlign: 'center',
  },
  emptyCta: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.text,
    borderRadius: radius.pill,
  },
  emptyCtaText: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.5,
    fontSize: 12,
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
    maxHeight: '70%',
  },
  modalSheetLarge: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    maxHeight: '85%',
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
  modalOptionTextActive: { fontFamily: 'Inter_700Bold' },
  filterGroup: { paddingVertical: spacing.md },
  filterGroupLabel: {
    ...typography.tiny,
    color: colors.text,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: { borderColor: colors.text },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.text,
  },
  filterOptionText: { ...typography.body, color: colors.text, flex: 1 },
  filterOptionTextActive: { fontFamily: 'Inter_600SemiBold' },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    marginBottom: spacing.sm,
  },
  modalFooterBtn: {
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalFooterBtnGhost: {
    borderWidth: 1,
    borderColor: colors.border,
    flexShrink: 0,
  },
  modalFooterBtnPrimary: {
    flex: 1,
    backgroundColor: colors.text,
  },
  modalFooterTextGhost: {
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.5,
    fontSize: 12,
    color: colors.text,
  },
  modalFooterTextPrimary: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.5,
    fontSize: 12,
  },
});
