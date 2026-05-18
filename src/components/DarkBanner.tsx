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
  onPress?: () => void;
};

export const DarkBanner = ({
  eyebrow,
  big,
  small,
  cta,
  image,
  height = 160,
  onPress,
}: Props) => {
  const content = (
    <View style={styles.content}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.big}>{big}</Text>
      {small ? <Text style={styles.small}>{small}</Text> : null}
      {cta ? (
        <Pressable style={styles.cta} onPress={onPress}>
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
    width: '100%',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  eyebrow: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 6,
    marginBottom: spacing.sm,
  },
  big: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    color: colors.white,
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  small: {
    ...typography.tiny,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.sm,
    letterSpacing: 4,
  },
  cta: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  ctaText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: colors.black,
    letterSpacing: 3,
  },
});
