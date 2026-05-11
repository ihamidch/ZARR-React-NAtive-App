import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { featuredCollections } from '../data';
import { colors, radius, spacing, typography } from '../theme';

type Props = {
  onPress?: (collectionId: string, title: string) => void;
};

export const FeaturedCollections = ({ onPress }: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {featuredCollections.map((c) => (
        <Pressable
          key={c.id}
          style={styles.card}
          onPress={() => onPress?.(c.id, c.title)}
        >
          <ImageBackground
            source={{ uri: c.image }}
            style={styles.image}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.overlay} />
            <View style={styles.titleWrap}>
              <Text style={styles.title}>{c.title}</Text>
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
    width: 230,
    height: 320,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
  titleWrap: {
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  title: {
    ...typography.h1,
    color: colors.white,
    fontSize: 22,
  },
  divider: {
    width: 24,
    height: 1.5,
    backgroundColor: colors.white,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  cta: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 2,
  },
});
