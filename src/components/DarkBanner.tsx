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
  big: string;
  small?: string;
  cta?: string;
  image?: string;
  height?: number;
};

export const DarkBanner = ({
  eyebrow,
  big,
  small,
  cta,
  image,
  height = 160,
}: Props) => {
  const content = (
    <View style={styles.content}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.big}>{big}</Text>
      {small ? <Text style={styles.small}>{small}</Text> : null}
      {cta ? (
        <Pressable style={styles.cta}>
          <Text style={styles.ctaText}>{cta}</Text>
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <View style={[styles.wrapper, { height }]}>
      {image ? (
        <ImageBackground
          source={{ uri: image }}
          style={styles.bg}
          imageStyle={styles.bgImage}
        >
          <View style={styles.tint} />
          {content}
        </ImageBackground>
      ) : (
        <View style={[styles.bg, { backgroundColor: '#0A0A0A' }]}>
          {content}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  bg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgImage: {
    resizeMode: 'cover',
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,8,8,0.65)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  eyebrow: {
    ...typography.tiny,
    color: colors.gold,
    letterSpacing: 4,
    marginBottom: spacing.xs,
  },
  big: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    color: colors.white,
    letterSpacing: 3,
    textAlign: 'center',
  },
  small: {
    ...typography.tiny,
    color: '#D6CDBE',
    marginTop: spacing.xs,
    letterSpacing: 3,
  },
  cta: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: radius.pill,
  },
  ctaText: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 2,
  },
});
