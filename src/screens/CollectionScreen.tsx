import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProductCard } from '../components/ProductCard';
import {
  allProducts,
  getCollectionById,
  getProductsByCollection,
} from '../data';
import type { CollectionScreenProps } from '../types/navigation';
import { colors, radius, spacing, typography } from '../theme';

type SortKey = 'featured' | 'priceLow' | 'priceHigh' | 'newest';
const SORTS: { id: SortKey; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'priceLow', label: 'Price: Low to High' },
  { id: 'priceHigh', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest' },
];

const FILTERS = ['All', 'Women', 'Men', 'On Sale'] as const;
type Filter = (typeof FILTERS)[number];

export const CollectionScreen = ({ route, navigation }: CollectionScreenProps) => {
  const { collectionId, title } = route.params;
  const collection = getCollectionById(collectionId);
  const isCategory = ['women', 'men', 'kids'].includes(collectionId);

  const [sort, setSort] = useState<SortKey>('featured');
  const [filter, setFilter] = useState<Filter>('All');
  const [sortOpen, setSortOpen] = useState(false);

  const products = useMemo(() => {
    let list = isCategory
      ? allProducts.filter((p) =>
          collectionId === 'kids' ? false : p.category === collectionId,
        )
      : getProductsByCollection(collectionId);

    if (filter === 'Women') list = list.filter((p) => p.category === 'women');
    if (filter === 'Men') list = list.filter((p) => p.category === 'men');
    if (filter === 'On Sale') list = list.filter((p) => !!p.discountPercent);

    if (sort === 'priceLow') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'priceHigh') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'newest') list = [...list].reverse();

    return list;
  }, [collectionId, isCategory, filter, sort]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.underline} />
        </View>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="bag-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      {collection?.description ? (
        <Text style={styles.description}>{collection.description}</Text>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <Pressable
              key={f}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  active && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.sortBar}>
        <Text style={styles.count}>{products.length} items</Text>
        <Pressable
          style={styles.sortBtn}
          onPress={() => setSortOpen((v) => !v)}
        >
          <Ionicons name="swap-vertical" size={14} color={colors.text} />
          <Text style={styles.sortText}>
            {SORTS.find((s) => s.id === sort)?.label}
          </Text>
        </Pressable>
      </View>

      {sortOpen ? (
        <View style={styles.sortDropdown}>
          {SORTS.map((s) => (
            <Pressable
              key={s.id}
              style={styles.sortOption}
              onPress={() => {
                setSort(s.id);
                setSortOpen(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  s.id === sort && styles.sortOptionTextActive,
                ]}
              >
                {s.label}
              </Text>
              {s.id === sort ? (
                <Ionicons name="checkmark" size={16} color={colors.text} />
              ) : null}
            </Pressable>
          ))}
        </View>
      ) : null}

      {products.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cube-outline" size={42} color={colors.textMuted} />
          <Text style={styles.emptyText}>
            No products yet in this collection.
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <ProductCard
                product={item}
                width={undefined as unknown as number}
                onPress={() =>
                  navigation.navigate('ProductDetail', { productId: item.id })
                }
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
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
  description: {
    ...typography.small,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: spacing.sm,
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  filterText: {
    ...typography.smallMed,
    color: colors.text,
    letterSpacing: 1,
  },
  filterTextActive: { color: colors.white },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  count: { ...typography.smallMed, color: colors.textMuted },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sortText: { ...typography.smallMed, color: colors.text },
  sortDropdown: {
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sortOptionText: { ...typography.body, color: colors.text },
  sortOptionTextActive: { fontFamily: 'Inter_700Bold' },
  gridContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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
});
