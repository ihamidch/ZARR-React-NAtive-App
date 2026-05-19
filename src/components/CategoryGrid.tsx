import React, { useMemo } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { categories as mockCategories } from '../data';
import { useCollections } from '../hooks/useProducts';
import { colors, radius, shadows, spacing, typography } from '../theme';

type Props = {
  onPress?: (categoryId: string, title: string) => void;
};

// Top-level shop categories surfaced as image tiles. When the Shopify
// store exposes collections with the right handles (women / men / kids /
// unisex / sale), prefer those images so the grid mirrors the live store.
const FALLBACK_HANDLES = ['women', 'men', 'unisex', 'kids', 'sale'];

export const CategoryGrid = ({ onPress }: Props) => {
  const { data: liveCollections, source } = useCollections();

  const categories = useMemo(() => {
    if (source !== 'live' || !liveCollections.length) return mockCategories;
    const list = FALLBACK_HANDLES.map((handle) => {
      const live = liveCollections.find(
        (c) => c.id.toLowerCase() === handle,
      );
      const mock = mockCategories.find((c) => c.id === handle);
      if (!live && !mock) return null;
      return {
        id: handle,
        title: live?.title || mock?.title || handle,
        image: live?.image || mock?.image || '',
      };
    }).filter(Boolean) as { id: string; title: string; image: string }[];
    return list.length ? list : mockCategories;
  }, [liveCollections, source]);

  const [first, ...rest] = categories;
  if (!first) return null;
  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          styles.cardLarge,
          pressed && { transform: [{ scale: 0.99 }] },
        ]}
        onPress={() => onPress?.(first.id, first.title)}
      >
        <ImageBackground
          source={{ uri: first.image }}
          style={styles.image}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlayTop} />
          <View style={styles.overlayBottom} />
          <View style={styles.labelWrap}>
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowLine} />
              <Text style={styles.eyebrow}>SHOP</Text>
            </View>
            <Text style={styles.label}>{first.title}</Text>
          </View>
        </ImageBackground>
      </Pressable>
      <View style={styles.row}>
        {rest.map((cat) => (
          <Pressable
            key={cat.id}
            style={({ pressed }) => [
              styles.card,
              styles.cardSmall,
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => onPress?.(cat.id, cat.title)}
          >
            <ImageBackground
              source={{ uri: cat.image }}
              style={styles.image}
              imageStyle={styles.imageStyle}
            >
              <View style={styles.overlayTop} />
              <View style={styles.overlayBottom} />
              <View style={styles.labelWrap}>
                <Text style={styles.labelSmall}>{cat.title}</Text>
              </View>
            </ImageBackground>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  cardLarge: {
    width: '100%',
    height: 230,
  },
  cardSmall: {
    flex: 1,
    height: 190,
    borderRadius: 95,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  labelWrap: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 6,
  },
  eyebrowLine: {
    width: 18,
    height: 1,
    backgroundColor: colors.gold,
  },
  eyebrow: {
    ...typography.tiny,
    color: colors.gold,
    letterSpacing: 3,
  },
  label: {
    ...typography.hero,
    color: colors.white,
    fontSize: 34,
    textTransform: 'capitalize',
  },
  labelSmall: {
    ...typography.h1,
    color: colors.white,
    fontSize: 14,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
});
