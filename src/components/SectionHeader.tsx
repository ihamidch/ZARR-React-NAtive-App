import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

type Props = {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
};

export const SectionHeader = ({ title, subtitle, onSeeAll }: Props) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <View style={styles.line} />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.line} />
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {onSeeAll ? (
        <Pressable onPress={onSeeAll} style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>VIEW ALL  →</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  line: {
    width: 32,
    height: 1,
    backgroundColor: colors.divider,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    letterSpacing: 1,
  },
  seeAllBtn: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  seeAllText: {
    ...typography.tiny,
    color: colors.text,
    letterSpacing: 2,
  },
});
