import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { featuredCollections as mockCollections } from '../data';
import { useCollections } from '../hooks/useProducts';
import { productApi } from '../services/api';
import { colors, radius, shadows, spacing, typography } from '../theme';

type Props = {
  onPress?: (collectionId: string, title: string) => void;
};

export const FeaturedCollections = ({ onPress }: Props) => {
  const { data: liveCollections, source } = useCollections();
  const collections =
    source === 'live' && liveCollections.length
      ? liveCollections
      : mockCollections;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>FEATURED COLLECTIONS</Text>
        <View style={styles.arrowContainer}>
          <Pressable style={styles.arrowBtn}>
            <Ionicons name="arrow-back-outline" size={16} color="#111111" />
          </Pressable>
          <Pressable style={styles.arrowBtn}>
            <Ionicons name="arrow-forward-outline" size={16} color="#111111" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {collections.map((c) => (
          <CollectionCard key={c.id} collection={c} onPress={onPress} />
        ))}
      </ScrollView>
    </View>
  );
};

const LIFESTYLE_FALLBACK = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80';

const CollectionCard = ({ collection: c, onPress }: { collection: any, onPress: any }) => {
  const [displayImage, setDisplayImage] = useState(c.image || LIFESTYLE_FALLBACK);

  useEffect(() => {
    const isBanner = !c.image || 
                     c.image.toLowerCase().includes('banner') || 
                     c.image.toLowerCase().includes('shop') ||
                     c.image.toLowerCase().includes('placeholder');
                     
    if (isBanner) {
      productApi.getCollectionProducts(c.id)
        .then(products => {
          if (products && Array.isArray(products) && products.length > 0) {
            const productWithImage = products.find(p => p.image);
            if (productWithImage) setDisplayImage(productWithImage.image);
          }
        })
        .catch(() => {});
    } else {
      setDisplayImage(c.image);
    }
  }, [c.id, c.image]);

  // Premium mock brands for luxury Pakistani aesthetic
  const collectionBrands: Record<string, string> = {
    'spring-edit': 'MANTO',
    'eastern-classic': 'SANA SAFINAZ',
    'lawn-luxe': 'BEYOND EAST',
    'party-chic': 'KIARA OFFICIAL',
  };
  const brandLabel = collectionBrands[c.id] || c.description || 'ZARR SELECT';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && { transform: [{ scale: 0.985 }] },
      ]}
      onPress={() => onPress?.(c.id, c.title)}
    >
      <View style={styles.cardImageWrap}>
        <Image source={{ uri: displayImage }} style={styles.cardImage} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {c.title.toUpperCase()}
        </Text>
        <Text style={styles.cardBrand}>{brandLabel.toUpperCase()}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    letterSpacing: 1,
    color: '#111111',
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  row: {
    paddingHorizontal: 16,
    gap: 14,
  },
  cardContainer: {
    width: 176,
  },
  cardImageWrap: {
    width: 176,
    height: 236,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardInfo: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  cardTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#111111',
    letterSpacing: 0.5,
  },
  cardBrand: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: '#B7984A', // Gorgeous brand gold accent
    letterSpacing: 1.2,
    marginTop: 2,
  },
});
