import React from 'react';
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
import { CategoryGrid } from '../components/CategoryGrid';
import { FeaturedCollections } from '../components/FeaturedCollections';
import { ProductCarousel } from '../components/ProductCarousel';
import { FeaturedBrands } from '../components/FeaturedBrands';
import { DarkBanner } from '../components/DarkBanner';
import { OffersSection } from '../components/OffersSection';
import { Footer } from '../components/Footer';
import { Section } from '../components/Section';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { ShopByType } from '../components/ShopByType';
import type { HomeScreenProps } from '../types/navigation';
import { colors, spacing, typography } from '../theme';
import { useHomeFeed } from '../hooks/useProducts';
import { useAuth } from '../context/AuthContext';

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { data, status, refresh, source, error } = useHomeFeed();
  const { isAuthenticated } = useAuth();

  const goCollection = (collectionId: string, title: string) =>
    navigation.navigate('Collection', { collectionId, title });
  const goProduct = (productId: string) =>
    navigation.navigate('ProductDetail', { productId });

  const goAccount = () =>
    isAuthenticated
      ? navigation.navigate('Account')
      : navigation.navigate('Login');

  const goTab = (tab: 'WOMEN' | 'MEN' | 'KIDS') => {
    if (tab === 'KIDS') {
      goCollection('kids', 'Kids');
    } else if (tab === 'MEN') {
      goCollection('men', 'Men');
    } else {
      goCollection('women', 'Women');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Header
        onAccountPress={goAccount}
        onTabPress={goTab}
        isAuthenticated={isAuthenticated}
      />
      <DataSourceBadge
        source={source}
        status={status}
        label="zarr.com.pk"
        onPress={refresh}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={refresh}
            tintColor={colors.text}
          />
        }
      >
        {status === 'loading' && source === 'mock' ? (
          <View style={styles.loadingBar}>
            <ActivityIndicator color={colors.text} size="small" />
            <Text style={styles.loadingText}>Refreshing collection…</Text>
          </View>
        ) : null}

        {source === 'mock' && error ? (
          <View style={styles.bannerNotice}>
            <Text style={styles.bannerNoticeText}>
              Showing offline preview — connect the backend to see live
              products.
            </Text>
          </View>
        ) : null}

        <Section background={colors.sectionWhite} paddingBottom={0}>
          <HeroBanner
            eyebrow="NEW SEASON · '26"
            title={`Western\nEdit`}
            subtitle="Trending looks, bold details, and fresh silhouettes — explore what everyone's loving this season."
            cta="SHOP THE EDIT"
            image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
          />
        </Section>

        <Section background={colors.sectionWhite} paddingBottom={8}>
          <SectionHeader
            title="Shop By Type"
            subtitle="Accessories · Eastern · Western · Lawn · Kids · Sale"
          />
          <ShopByType onPress={goCollection} />
        </Section>

        <Section background={colors.sectionWhite}>
          <SectionHeader
            title="Shop By Category"
            subtitle="Curated for every mood"
          />
          <CategoryGrid onPress={goCollection} />
        </Section>

        <Section background={colors.sectionCream}>
          <SectionHeader
            title="Featured Collections"
            subtitle="The drops everyone's talking about"
          />
          <FeaturedCollections onPress={goCollection} />
        </Section>

        <Section background={colors.sectionWhite}>
          <SectionHeader
            title="Popular Right Now"
            subtitle="What's trending this week"
          />
          <ProductCarousel
            tabs={[
              {
                id: 'women',
                label: 'WOMEN',
                heroTitle: 'Trendy Women Outfits',
                heroSubtitle:
                  "Bold details and fresh silhouettes — explore what everyone's loving.",
                heroImage:
                  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
                products: data.popularWomen,
              },
              {
                id: 'men',
                label: 'MEN',
                heroTitle: 'Trendy Men Outfits',
                heroSubtitle:
                  'Laid-back essentials and standout streetwear making waves.',
                heroImage:
                  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
                products: data.popularMen,
              },
            ]}
            onProductPress={goProduct}
            onSeeAllPress={(tabId) =>
              goCollection(tabId, tabId === 'women' ? 'Women' : 'Men')
            }
          />
        </Section>

        <Section background={colors.sectionRose}>
          <SectionHeader
            title="On Sale Right Now"
            subtitle="Up to 70% off — limited time"
          />
          <ProductCarousel
            tabs={[
              {
                id: 'women',
                label: 'WOMEN',
                heroTitle: 'Sale For Her',
                heroSubtitle:
                  "Your favorite looks at can't-miss prices — shop before they're gone.",
                heroImage:
                  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
                products: data.saleWomen,
              },
              {
                id: 'men',
                label: 'MEN',
                heroTitle: 'Sale For Him',
                heroSubtitle:
                  'Style meets savings — upgrade your wardrobe with limited-time deals.',
                heroImage:
                  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
                products: data.saleMen,
              },
            ]}
            onProductPress={goProduct}
            onSeeAllPress={(tabId) =>
              goCollection(
                `${tabId}-sale`,
                tabId === 'women' ? 'Sale For Her' : 'Sale For Him',
              )
            }
          />
        </Section>

        <Section background={colors.sectionDark} paddingBottom={16}>
          <DarkBanner
            eyebrow="MARKETPLACE"
            big="SHOP THE TOP BRANDS"
            small="ON ZARR"
            cta="EXPLORE BRANDS"
            image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
            height={170}
          />
        </Section>

        <Section background={colors.sectionBeige}>
          <SectionHeader
            title="Featured Brands"
            subtitle="Pakistan's finest fashion labels"
          />
          <FeaturedBrands />
        </Section>

        <Section background={colors.sectionWhite}>
          <SectionHeader
            title="Offers Just For You"
            subtitle="Perks of shopping at ZARR"
          />
          <OffersSection />
        </Section>

        <View style={{ height: 12 }} />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, backgroundColor: colors.background },
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
