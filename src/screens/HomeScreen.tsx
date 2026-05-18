import React, { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { HeroBanner } from '../components/HeroBanner';
import { SectionHeader } from '../components/SectionHeader';
import { ShopByType } from '../components/ShopByType';
import { ProductGrid } from '../components/ProductGrid';
import { ProductCarousel } from '../components/ProductCarousel';
import { DarkBanner } from '../components/DarkBanner';
import { Footer } from '../components/Footer';
import { SideMenu } from '../components/SideMenu';
import type { HomeScreenProps } from '../types/navigation';
import { colors, spacing, typography } from '../theme';
import { useHomeFeed } from '../hooks/useProducts';
import { useAuth } from '../context/AuthContext';

const HOME_BANNERS = [
  {
    id: 'b1',
    eyebrow: "NEW SEASON · '26",
    title: `Western\nEdit`,
    subtitle: "Trending looks, bold details, and fresh silhouettes.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 'b2',
    eyebrow: "LUXURY LAWN",
    title: `Summer\nBreeze`,
    subtitle: "Embrace the heat with our breathable collections.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  },
];

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { data, status, refresh, source, error } = useHomeFeed();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goCollection = (collectionId: string, title: string) =>
    navigation.navigate('Collection', { collectionId, title });
    
  const goProduct = (productId: string) =>
    navigation.navigate('ProductDetail', { productId });

  const goBrand = (brandName: string) =>
    navigation.navigate('Collection', {
      collectionId: brandName,
      title: brandName,
    });

  const goAccount = () =>
    isAuthenticated
      ? navigation.navigate('Account')
      : navigation.navigate('Login');

  const goCart = () => navigation.navigate('Cart');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <Header
        onMenuPress={() => setIsMenuOpen(true)}
        onAccountPress={goAccount}
        onCartPress={goCart}
        isAuthenticated={isAuthenticated}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={refresh}
            tintColor={colors.black}
          />
        }
      >
        {status === 'loading' && source === 'mock' ? (
          <View style={styles.loadingBar}>
            <ActivityIndicator color={colors.black} size="small" />
            <Text style={styles.loadingText}>Refreshing collection…</Text>
          </View>
        ) : null}

        {/* 1. HERO CAROUSEL */}
        <HeroBanner banners={HOME_BANNERS} />

        {/* 2. CATEGORY SECTION */}
        <View style={styles.sectionPadding}>
          <SectionHeader
            title="SHOP BY CATEGORY"
            subtitle="Curated for every mood"
          />
          <ShopByType onPress={goCollection} />
        </View>

        {/* 3. NEW ARRIVALS (ProductGrid) */}
        <View style={styles.sectionPaddingWhite}>
          <SectionHeader
            title="NEW ARRIVALS"
            subtitle="Fresh drops to elevate your style"
          />
          <ProductGrid products={data.popularWomen} onProductPress={goProduct} />
        </View>

        {/* 4. PROMOTIONAL BANNER */}
        <DarkBanner
          eyebrow="LUXURY EDIT"
          big="THE SUMMER CAPSULE"
          small="LIMITED EDITION PIECES"
          cta="EXPLORE NOW"
          image="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80"
          height={400}
          onPress={() => goCollection('summer', 'Summer Capsule')}
        />

        {/* 5. BEST SELLERS (ProductCarousel) */}
        <View style={styles.sectionPadding}>
          <SectionHeader
            title="BEST SELLERS"
            subtitle="Everyone's loving these"
          />
          <ProductCarousel products={data.saleWomen} onProductPress={goProduct} />
        </View>

        <Footer />
      </ScrollView>

      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={(type, id, title) => {
          if (type === 'brand') {
            goBrand(id);
          } else {
            goCollection(id, title);
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  scroll: { flex: 1, backgroundColor: colors.background },
  sectionPadding: {
    paddingVertical: spacing.xl,
    backgroundColor: colors.background,
  },
  sectionPaddingWhite: {
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
  },
  loadingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  loadingText: { ...typography.small, color: colors.textMuted },
  bannerNotice: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  bannerNoticeText: {
    ...typography.small,
    color: colors.text,
    textAlign: 'center',
  },
});
