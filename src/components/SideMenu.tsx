import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../theme';

const { width, height } = Dimensions.get('window');

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (type: string, id: string, title: string) => void;
};

const SECTIONS = [
  {
    title: 'CATEGORIES',
    items: [
      { id: 'women', label: 'Women', icon: 'woman-outline' },
      { id: 'men', label: 'Men', icon: 'man-outline' },
      { id: 'kids', label: 'Kids', icon: 'happy-outline' },
      { id: 'accessories', label: 'Accessories', icon: 'watch-outline' },
    ],
  },
  {
    title: 'BRANDS',
    items: [
      { id: 'Sana Safinaz', label: 'Sana Safinaz' },
      { id: 'Hussain Rehar', label: 'Hussain Rehar' },
      { id: 'Mushq', label: 'Mushq' },
      { id: 'Manto', label: 'Manto' },
      { id: 'Junaid Jamshed', label: 'Junaid Jamshed' },
    ],
  },
  {
    title: 'LIFESTYLE',
    items: [
      { id: 'sale', label: 'Sale', icon: 'pricetag-outline', color: colors.sale },
      { id: 'new-arrivals', label: 'New Arrivals', icon: 'sparkles-outline' },
      { id: 'eastern', label: 'Eastern Wear', icon: 'shirt-outline' },
      { id: 'western', label: 'Western Wear', icon: 'star-outline' },
    ],
  },
];

export const SideMenu = ({ isOpen, onClose, onNavigate }: Props) => {
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  if (!isOpen && slideAnim._value === -width) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View style={[styles.backdropInner, { opacity: opacityAnim }]} />
      </Pressable>

      {/* Menu Content */}
      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={[typography.brand, { color: colors.gold, fontSize: 24 }]}>ZARR</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={28} color={colors.black} />
            </Pressable>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {SECTIONS.map((section, idx) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.item}
                  onPress={() => {
                    onClose();
                    onNavigate(section.title === 'BRANDS' ? 'brand' : 'collection', item.id, item.label);
                  }}
                >
                  <View style={styles.itemLeft}>
                    {item.icon && (
                      <Ionicons 
                        name={item.icon as any} 
                        size={20} 
                        color={item.color || colors.textMuted} 
                        style={styles.icon} 
                      />
                    )}
                    <Text style={[styles.itemLabel, item.color ? { color: item.color } : null]}>
                      {item.label}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.borderStrong} />
                </Pressable>
              ))}
            </View>
          ))}

          <View style={styles.footer}>
            <Pressable style={styles.footerItem}>
              <Ionicons name="person-outline" size={20} color={colors.text} />
              <Text style={styles.footerText}>Account Settings</Text>
            </Pressable>
            <Pressable style={styles.footerItem}>
              <Ionicons name="location-outline" size={20} color={colors.text} />
              <Text style={styles.footerText}>Track Order</Text>
            </Pressable>
            <Pressable style={styles.footerItem}>
              <Ionicons name="help-circle-outline" size={20} color={colors.text} />
              <Text style={styles.footerText}>Customer Support</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropInner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    width: width * 0.8,
    height: '100%',
    backgroundColor: colors.white,
    ...shadows.floating,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    padding: spacing.xs,
  },
  scroll: {
    paddingBottom: 40,
  },
  section: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.tiny,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.md,
    fontWeight: '700',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.md,
    width: 24,
  },
  itemLabel: {
    ...typography.bodyMed,
    color: colors.text,
    fontSize: 15,
  },
  footer: {
    marginTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.xl,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  footerText: {
    ...typography.body,
    color: colors.text,
    fontSize: 14,
  },
});
