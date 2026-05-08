import React from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

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
        <View style={styles.gradient} />
        <View style={styles.content}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <Pressable style={styles.cta}>
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
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  bg: {
    width: '100%',
    height: 420,
    justifyContent: 'flex-end',
  },
  bgImage: {
    resizeMode: 'cover',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  content: {
    padding: spacing.xl,
  },
  eyebrow: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 4,
    marginBottom: spacing.sm,
    opacity: 0.9,
  },
  title: {
    ...typography.hero,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.92,
    marginBottom: spacing.lg,
    lineHeight: 22,
    maxWidth: '85%',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    gap: spacing.sm,
  },
  ctaText: {
    ...typography.smallMed,
    color: colors.text,
    letterSpacing: 2,
  },
  ctaArrow: {
    ...typography.smallMed,
    color: colors.text,
  },
});
