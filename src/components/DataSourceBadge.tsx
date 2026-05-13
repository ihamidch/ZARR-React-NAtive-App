import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../theme';

type Props = {
  source: 'live' | 'mock';
  status: 'idle' | 'loading' | 'ready' | 'error';
  label?: string;
  onPress?: () => void;
};

// Small, floating status chip pinned to the bottom-right that confirms a
// screen is showing live Shopify data. Stays out of the way visually and
// only appears during development.
export const DataSourceBadge = ({ source, status, label, onPress }: Props) => {
  if (!__DEV__) return null;

  const isLive = source === 'live';
  const isLoading = status === 'loading';

  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isLive) return;
    pulse.setValue(0);
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [isLive, pulse]);

  const dotOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const tone = isLoading
    ? colors.textMuted
    : isLive
      ? colors.success
      : colors.sale;

  const text = isLoading ? 'Syncing' : isLive ? 'Live' : 'Offline';

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable onPress={onPress} hitSlop={8} style={styles.chip}>
        <Animated.View
          style={[styles.dot, { backgroundColor: tone, opacity: dotOpacity }]}
        />
        <Text style={styles.text}>
          {text}
          {label ? (
            <Text style={styles.subtle}> · {label}</Text>
          ) : null}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    zIndex: 1000,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(22,22,22,0.88)',
    ...shadows.floating,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  text: {
    ...typography.tiny,
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  subtle: {
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
    letterSpacing: 0.4,
  },
});
