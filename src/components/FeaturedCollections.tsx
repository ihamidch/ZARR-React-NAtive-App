import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {collections.map((c) => (
        <CollectionCard key={c.id} collection={c} onPress={onPress} />
      ))}
    </ScrollView>
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

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.97 }] },
      ]}
      onPress={() => onPress?.(c.id, c.title)}
    >
      <ImageBackground
        source={{ uri: displayImage }}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        {/* Layered Gradients for Professional Contrast */}
        <View style={styles.gradientBottom} />
        <View style={styles.gradientBottomDeep} />
        
        <View style={styles.contentOverlay}>
          <View style={styles.glassTitleBox}>
            <Text style={styles.eyebrow}>THE COLLECTION</Text>
            <Text style={styles.title} numberOfLines={2}>
              {c.title}
            </Text>
            <View style={styles.premiumDivider} />
            <View style={styles.ctaRow}>
              <Text style={styles.ctaText}>EXPLORE NOW</Text>
              <View style={styles.ctaCircle}>
                <Text style={styles.arrow}>→</Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  card: {
    width: 280,
    height: 420,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    ...shadows.floating,
  },
  image: {
    flex: 1,
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  gradientBottomDeep: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  contentOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  glassTitleBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)', // For web support, native will ignore
  },
  eyebrow: {
    ...typography.tiny,
    color: colors.gold,
    letterSpacing: 4,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  title: {
    ...typography.h1,
    color: colors.white,
    fontSize: 26,
    lineHeight: 32,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  premiumDivider: {
    width: 40,
    height: 2,
    backgroundColor: colors.gold,
    marginBottom: spacing.lg,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaText: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 2,
    fontWeight: '800',
  },
  ctaCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
