import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
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
import { popularMen, popularWomen, saleMen, saleWomen } from '../data';
import { colors } from '../theme';

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Header />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Section background={colors.sectionWhite} paddingBottom={0}>
          <HeroBanner
            eyebrow="NEW SEASON · '26"
            title={`Western\nEdit`}
            subtitle="Trending looks, bold details, and fresh silhouettes — explore what everyone's loving this season."
            cta="SHOP THE EDIT"
            image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
          />
        </Section>

        <Section background={colors.sectionWhite}>
          <SectionHeader
            title="Shop By Category"
            subtitle="Curated for every mood"
          />
          <CategoryGrid />
        </Section>

        <Section background={colors.sectionCream}>
          <SectionHeader
            title="Featured Collections"
            subtitle="The drops everyone's talking about"
          />
          <FeaturedCollections />
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
                products: popularWomen,
              },
              {
                id: 'men',
                label: 'MEN',
                heroTitle: 'Trendy Men Outfits',
                heroSubtitle:
                  'Laid-back essentials and standout streetwear making waves.',
                heroImage:
                  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
                products: popularMen,
              },
            ]}
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
                products: saleWomen,
              },
              {
                id: 'men',
                label: 'MEN',
                heroTitle: 'Sale For Him',
                heroSubtitle:
                  'Style meets savings — upgrade your wardrobe with limited-time deals.',
                heroImage:
                  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
                products: saleMen,
              },
            ]}
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
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
