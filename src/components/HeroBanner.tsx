import React from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../theme';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  image: string;
};

export const HeroBanner = ({
  eyebrow = 'NEW SEASON',
  title,
  subtitle,
  cta = 'SHOP NOW',
  image,
}: Props) => {
  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        {/* Layered overlays: subtle top dim + strong bottom dim for readability */}
        <View style={styles.overlayTop} />
        <View style={styles.overlayBottom} />

        <View style={styles.content}>
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowLine} />
            <Text style={styles.eyebrow}>{eyebrow}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <Pressable
            style={({ pressed }) => [
              styles.cta,
              pressed && { transform: [{ scale: 0.97 }], opacity: 0.95 },
            ]}
          >
            <Text style={styles.ctaText}>{cta}</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  bg: {
    width: '100%',
    height: 440,
    justifyContent: 'flex-end',
  },
  bgImage: {
    resizeMode: 'cover',
  },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  eyebrowLine: {
    width: 28,
    height: 1,
    backgroundColor: colors.gold,
  },
  eyebrow: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 3,
  },
  title: {
    ...typography.hero,
    color: colors.white,
    marginBottom: spacing.md,
    fontSize: 42,
    lineHeight: 46,
  },
  subtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.94,
    marginBottom: spacing.xl,
    lineHeight: 22,
    maxWidth: '88%',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    gap: spacing.sm,
    ...shadows.soft,
  },
  ctaText: {
    ...typography.smallMed,
    color: colors.text,
    letterSpacing: 2.5,
    fontWeight: '700',
  },
  ctaArrow: {
    ...typography.smallMed,
    color: colors.gold,
    fontSize: 14,
    fontWeight: '700',
  },
});
