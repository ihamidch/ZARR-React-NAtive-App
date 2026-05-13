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

export const Header = () => {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('WOMEN');

  return (
    <View style={styles.wrapper}>
      {/* 1. Announcement Bar (Deep Black) */}
      <View style={styles.announcementBar}>
        <Text style={styles.announcementText}>
          NEW RELEASES: <Text style={{ color: colors.gold }}>EASTERN LUXURY '26</Text>
        </Text>
      </View>

      {/* 2. Brand Row */}
      <View style={styles.topRow}>
        <Pressable hitSlop={12}>
          <Ionicons name="menu-outline" size={26} color={colors.black} />
        </Pressable>

        <View style={styles.logoContainer}>
          {/* ZARR in Gold */}
          <Text style={[typography.brand, { color: colors.gold }]}>ZARR</Text>
          {/* Bottom Line in Black */}
          <View style={styles.logoBottomLine} />
        </View>

        <View style={styles.rightIcons}>
          <Pressable style={styles.iconCircle}>
            <Ionicons name="search-outline" size={22} color={colors.black} />
          </Pressable>
          <Pressable style={styles.iconCircle}>
            <Ionicons name="bag-outline" size={22} color={colors.black} />
            <View style={styles.goldBadge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* 3. Luxury Tab Bar */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.tabItem}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? colors.gold : colors.black }
                ]}
              >
                {tab}
              </Text>
              {/* Dynamic Gold Underline for active tab */}
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
    alignItems: 'center',
  },
  announcementText: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 2,
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