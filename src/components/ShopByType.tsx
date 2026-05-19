import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'women' | 'men' | 'kids'>('women');

  if (status === 'loading' && !data.length) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.text} size="small" />
      </View>
    );
  }

  if (!data.length) return null;

  const filteredData = data.filter((item) => {
    const id = item.id.toLowerCase();
    if (activeTab === 'women') {
      // Exclude pure men and kids shortcuts, show all women-focused/neutral items
      return id !== 'men' && id !== 'kids';
    } else if (activeTab === 'men') {
      return id === 'men' || id === 'western' || id === 'eastern' || id === 'accessories' || id === 'sale';
    } else {
      return id === 'kids' || id === 'sale';
    }
  });

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SHOP BY CATEGORY</Text>
      </View>

      {/* Interactive Tabs */}
      <View style={styles.tabRow}>
        {(['women', 'men', 'kids'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {filteredData.map((type) => {
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
                    <View style={styles.imageTint} />
                  </>
                ) : (
                  <View style={styles.imageFallback}>
                    <Ionicons name={iconName} size={26} color={colors.gold} />
                  </View>
                )}
                <View style={styles.ring} />
              </View>
              <Text style={styles.label} numberOfLines={2}>
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
    </View>
  );
};

const ITEM_SIZE = 72;

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#F5F5F7', // Cool-toned grey textured background
    paddingVertical: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E6E6',
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_700Bold', // Premium Serif header style
    fontSize: 22,
    letterSpacing: 1.5,
    color: '#111111',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  tabButton: {
    minWidth: 88,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#DADADA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#111111',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontFamily: 'Inter_500Medium',
    color: '#666666',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  tabTextActive: {
    color: '#111111',
    fontFamily: 'Inter_700Bold',
  },
  row: {
    paddingHorizontal: 16,
    gap: 12,
  },
  loading: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F7',
  },
  item: {
    width: ITEM_SIZE + 14,
    alignItems: 'center',
  },
  imageWrap: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ITEM_SIZE / 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    color: '#111111',
    fontSize: 10,
    letterSpacing: 0.4,
    textAlign: 'center',
    textTransform: 'uppercase',
    minHeight: 28,
  },
  count: {
    color: '#777777',
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
    marginTop: 2,
    opacity: 0.8,
  },
});
