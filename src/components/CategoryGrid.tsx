import React from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { categories } from '../data';
import { colors, radius, spacing, typography } from '../theme';

export const CategoryGrid = () => {
  const [first, ...rest] = categories;
  return (
    <View style={styles.wrapper}>
      <Pressable style={[styles.card, styles.cardLarge]}>
        <ImageBackground
          source={{ uri: first.image }}
          style={styles.image}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay} />
          <View style={styles.labelWrap}>
            <Text style={styles.eyebrow}>SHOP</Text>
            <Text style={styles.label}>{first.title}</Text>
          </View>
        </ImageBackground>
      </Pressable>
      <View style={styles.row}>
        {rest.map((cat) => (
          <Pressable key={cat.id} style={[styles.card, styles.cardSmall]}>
            <ImageBackground
              source={{ uri: cat.image }}
              style={styles.image}
              imageStyle={styles.imageStyle}
            >
              <View style={styles.overlay} />
              <View style={styles.labelWrap}>
                <Text style={styles.eyebrow}>SHOP</Text>
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
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  cardLarge: {
    width: '100%',
    height: 220,
  },
  cardSmall: {
    flex: 1,
    height: 180,
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
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  labelWrap: {
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  eyebrow: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 3,
    opacity: 0.85,
    marginBottom: 4,
  },
  label: {
    ...typography.hero,
    color: colors.white,
    fontSize: 32,
  },
  labelSmall: {
    ...typography.h1,
    color: colors.white,
    fontSize: 22,
  },
});
