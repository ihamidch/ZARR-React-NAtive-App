import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

const TABS = ['WOMEN', 'MEN', 'KIDS'] as const;

import { useCart } from '../context/CartContext';

type HeaderProps = {
  onAccountPress?: () => void;
  onCartPress?: () => void;
  onTabPress?: (tab: 'WOMEN' | 'MEN' | 'KIDS') => void;
  isAuthenticated?: boolean;
};

export const Header = ({
  onAccountPress,
  onCartPress,
  onTabPress,
  isAuthenticated,
}: HeaderProps) => {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('WOMEN');
  const { itemCount } = useCart();

  return (
    <View style={styles.wrapper}>
      <View style={styles.announcementBar}>
        <View style={styles.announcementDot} />
        <Text style={styles.announcementText}>
          NEW RELEASES: <Text style={{ color: colors.gold }}>EASTERN LUXURY '26</Text>
        </Text>
        <View style={styles.announcementDot} />
      </View>

      <View style={styles.topRow}>
        <Pressable hitSlop={12} style={styles.iconCircle}>
          <Ionicons name="menu-outline" size={24} color={colors.black} />
        </Pressable>

        <View style={styles.logoContainer}>
          <Text style={[typography.brand, { color: colors.gold }]}>ZARR</Text>
          <View style={styles.logoBottomLine} />
        </View>

        <View style={styles.rightIcons}>
          <Pressable style={styles.iconCircle}>
            <Ionicons name="search-outline" size={22} color={colors.black} />
          </Pressable>
          <Pressable style={styles.iconCircle} onPress={onAccountPress}>
            <Ionicons
              name={isAuthenticated ? 'person' : 'person-outline'}
              size={22}
              color={colors.black}
            />
            {isAuthenticated ? <View style={styles.statusDot} /> : null}
          </Pressable>
          <Pressable style={styles.iconCircle} onPress={onCartPress}>
            <Ionicons name="bag-outline" size={22} color={colors.black} />
            {itemCount > 0 && (
              <View style={styles.goldBadge}>
                <Text style={styles.badgeText}>{itemCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => {
                setActiveTab(tab);
                onTabPress?.(tab);
              }}
              style={styles.tabItem}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? colors.gold : colors.black },
                ]}
              >
                {tab}
              </Text>
              {isActive && <View style={styles.activeTabIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  announcementBar: {
    backgroundColor: colors.black,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  announcementDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
  announcementText: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 2.5,
    fontWeight: '700',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    height: 80,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBottomLine: {
    width: 45,
    height: 2,
    backgroundColor: colors.black, // Logo line is black
    marginTop: -4,
  },
  rightIcons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  goldBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: colors.gold,
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  badgeText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: spacing.sm,
  },
  tabItem: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  tabText: {
    ...typography.smallMed,
    letterSpacing: 3,
    fontWeight: '600',
  },
  activeTabIndicator: {
    marginTop: 4,
    width: 20,
    height: 2,
    backgroundColor: colors.gold, // Tab line turns gold when clicked
  },
});