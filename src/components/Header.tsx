import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

type Props = {
  onMenuPress?: () => void;
  onCartPress?: () => void;
};

const IconBtn = ({
  name,
  onPress,
  badge,
}: {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  badge?: number;
}) => (
  <Pressable style={styles.iconBtn} onPress={onPress} hitSlop={8}>
    <Ionicons name={name} size={22} color={colors.text} />
    {badge !== undefined && badge > 0 ? (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    ) : null}
  </Pressable>
);

const ZarrLogo = () => (
  <View style={styles.logoWrap}>
    <Text style={styles.logo}>ZARR</Text>
    <View style={styles.logoUnderline} />
  </View>
);

const TABS = ['WOMEN', 'MEN', 'KIDS'] as const;

export const Header = ({ onMenuPress, onCartPress }: Props) => {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('WOMEN');

  return (
    <View style={styles.wrapper}>
      <View style={styles.announcementBar}>
        <Text style={styles.announcementText}>
          FREE SHIPPING ON ORDERS OVER RS. 5,000  ·  EASY RETURNS
        </Text>
      </View>

      <View style={styles.topRow}>
        <IconBtn name="menu-outline" onPress={onMenuPress} />
        <ZarrLogo />
        <View style={styles.rightIcons}>
          <IconBtn name="heart-outline" />
          <IconBtn name="person-outline" />
          <IconBtn name="bag-outline" badge={0} onPress={onCartPress} />
        </View>
      </View>

      <View style={styles.searchRow}>
        <Ionicons
          name="search-outline"
          size={18}
          color={colors.textMuted}
          style={{ marginRight: spacing.sm }}
        />
        <TextInput
          placeholder="Search for products, brands and more"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={styles.tabBtn}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab}
              </Text>
              <View
                style={[
                  styles.tabUnderline,
                  active && styles.tabUnderlineActive,
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  announcementBar: {
    backgroundColor: colors.text,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementText: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    height: 60,
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    ...typography.brand,
  },
  logoUnderline: {
    marginTop: 2,
    width: 38,
    height: 1.5,
    backgroundColor: colors.text,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    height: 40,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: 0,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  tabBtn: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    ...typography.smallMed,
    letterSpacing: 2,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.text,
  },
  tabUnderline: {
    marginTop: 6,
    width: 24,
    height: 2,
    backgroundColor: 'transparent',
  },
  tabUnderlineActive: {
    backgroundColor: colors.text,
  },
});
