import React, { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';
import { colors, radius, spacing, typography } from '../theme';

type Tab = {
  id: string;
  label: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  products: Product[];
};

type Props = {
  tabs: Tab[];
};

export const ProductCarousel = ({ tabs }: Props) => {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <View>
      <View style={styles.tabRow}>
        {tabs.map((t) => (
          <Pressable
            key={t.id}
            style={[styles.tab, activeId === t.id && styles.tabActive]}
            onPress={() => setActiveId(t.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeId === t.id && styles.tabTextActive,
              ]}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {active.products.map((p) => (
          <ProductCard key={p.id} product={p} width={170} />
        ))}

        <ImageBackground
          source={{ uri: active.heroImage }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroEyebrow}>FEATURED</Text>
            <Text style={styles.heroTitle}>{active.heroTitle}</Text>
            <Text style={styles.heroSubtitle}>{active.heroSubtitle}</Text>
            <Pressable style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>VIEW ALL  →</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  tabText: {
    ...typography.smallMed,
    color: colors.text,
    letterSpacing: 1.5,
  },
  tabTextActive: {
    color: colors.white,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  hero: {
    width: 250,
    aspectRatio: 3 / 4,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroTextWrap: {
    padding: spacing.lg,
  },
  heroEyebrow: {
    ...typography.tiny,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.xs,
    letterSpacing: 3,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.white,
    fontSize: 22,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    ...typography.small,
    color: colors.white,
    opacity: 0.92,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  viewAllBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
  },
  viewAllText: {
    color: colors.text,
    ...typography.tiny,
    letterSpacing: 2,
  },
});
