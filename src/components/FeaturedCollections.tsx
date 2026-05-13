import React from 'react';
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
        <Pressable
          key={c.id}
          style={({ pressed }) => [
            styles.card,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => onPress?.(c.id, c.title)}
        >
          <ImageBackground
            source={{ uri: c.image }}
            style={styles.image}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.overlayTop} />
            <View style={styles.overlayBottom} />
            <View style={styles.titleWrap}>
              <Text style={styles.eyebrow}>COLLECTION</Text>
              <Text style={styles.title} numberOfLines={2}>
                {c.title}
              </Text>
              <View style={styles.divider} />
              <Text style={styles.cta}>EXPLORE  →</Text>
            </View>
          </ImageBackground>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  card: {
    width: 240,
    height: 340,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  titleWrap: {
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  eyebrow: {
    ...typography.tiny,
    color: colors.gold,
    letterSpacing: 3,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    fontSize: 24,
    textTransform: 'capitalize',
  },
  divider: {
    width: 28,
    height: 2,
    backgroundColor: colors.gold,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  cta: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 2.5,
    fontWeight: '700',
  },
});
