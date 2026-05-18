import React, { useState, useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import { useCart } from '../context/CartContext';

const ANNOUNCEMENTS = [
  "NEW RELEASES: EASTERN LUXURY '26",
  "FREE SHIPPING ON ORDERS OVER Rs. 5000",
  "SHOP THE SUMMER CLEARANCE SALE",
];

type HeaderProps = {
  onMenuPress?: () => void;
  onAccountPress?: () => void;
  onCartPress?: () => void;
  onTabPress?: (tab: 'WOMEN' | 'MEN' | 'KIDS') => void;
  isAuthenticated?: boolean;
};

export const Header = ({
  onMenuPress,
  onAccountPress,
  onCartPress,
  isAuthenticated,
}: HeaderProps) => {
  const { itemCount } = useCart();
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <View style={styles.wrapper}>
      {/* Announcement Bar */}
      <View style={styles.announcementBar}>
        <Animated.Text style={[styles.announcementText, { opacity: fadeAnim }]}>
          {ANNOUNCEMENTS[announcementIndex]}
        </Animated.Text>
      </View>

      {/* Main Header Row */}
      <View style={styles.topRow}>
        <View style={styles.leftIcons}>
          <Pressable hitSlop={12} style={styles.iconCircle} onPress={onMenuPress}>
            <Ionicons name="menu-outline" size={26} color={colors.black} />
          </Pressable>
        </View>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>ZARR</Text>
        </View>

        <View style={styles.rightIcons}>
          <Pressable style={styles.iconCircle}>
            <Ionicons name="search-outline" size={22} color={colors.black} />
          </Pressable>
          <Pressable style={styles.iconCircle}>
            <Ionicons name="heart-outline" size={22} color={colors.black} />
          </Pressable>
          <Pressable style={styles.iconCircle} onPress={onCartPress}>
            <Ionicons name="bag-outline" size={22} color={colors.black} />
            {itemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
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
  },
  announcementText: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 2.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 60,
  },
  leftIcons: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    letterSpacing: 4,
    color: colors.black,
  },
  rightIcons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    backgroundColor: colors.black,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
});