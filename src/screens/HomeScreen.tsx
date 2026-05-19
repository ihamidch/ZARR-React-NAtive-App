import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../data';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  useCollections,
  useHomeFeed,
} from '../hooks/useProducts';
import type { HomeScreenProps } from '../types/navigation';
import type { Collection, Product } from '../types';
import { FeaturedBrands } from '../components/FeaturedBrands';
import { FeaturedCollections } from '../components/FeaturedCollections';
import { Footer } from '../components/Footer';
import { ShopByType } from '../components/ShopByType';
import { SideMenu } from '../components/SideMenu';
import { HeroBanner } from '../components/HeroBanner';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type BannerInput = {
  id?: string;
  title?: string;
  headline?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  mobileImage?: string;
  desktopImage?: string;
  bannerImage?: string;
  cta?: string;
  buttonText?: string;
  collectionId?: string;
  handle?: string;
};

type HomeFeedShape = {
  banners?: BannerInput[];
  collections?: Collection[];
  featuredProducts?: Product[];
  newArrivals?: Product[];
  bestSellers?: Product[];
  popularWomen?: Product[];
  popularMen?: Product[];
  saleWomen?: Product[];
  saleMen?: Product[];
};

type HomeBanner = {
  id: string;
  title: string;
  subtitle?: string;
  cta: string;
  image: string;
  collectionId?: string;
};

type CategoryItem = {
  id: string;
  title: string;
  image?: string;
};

type ProductTab = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  products: Product[];
  collectionId: string;
};

const PROMO_MESSAGES = [
  'Free shipping on premium fashion picks',
  'New arrivals are now live on ZARR',
  'Exclusive drops from Pakistan fashion labels',
];

const HELP_LINKS = [
  'FAQs',
  'Contact Us',
  'Track Order',
  'Delivery, Return & Exchange Policy',
  'Terms & Conditions',
  'Privacy Policy',
];

const ABOUT_LINKS = ['About Us', 'Partner with Us'];

const SOCIAL_ICONS: IconName[] = [
  'logo-instagram',
  'logo-tiktok',
  'logo-pinterest',
  'logo-facebook',
  'logo-youtube',
  'logo-linkedin',
];

const firstString = (...values: unknown[]) => {
  const match = values.find(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  );
  return match?.trim() ?? '';
};

const dedupeProducts = (products: Product[]) => {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (!product?.id || seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
};

const getCollectionImage = (collection: Collection) =>
  firstString(collection.bannerImage, collection.image);

const STATIC_HERO_BANNERS: HomeBanner[] = [
  {
    id: 'static-hero-1',
    title: 'Women Unstitched',
    subtitle: 'Discover elegant fashion curated for you',
    cta: 'Shop Now',
    image: 'https://zarr.com.pk/cdn/shop/files/m4.webp?v=1778246304',
  },
  {
    id: 'static-hero-2',
    title: 'Women Ready-To-Wear',
    subtitle: 'Fresh styles for the season ahead',
    cta: 'Shop Now',
    image: 'https://zarr.com.pk/cdn/shop/files/m3.webp?v=1778246304',
  },
  {
    id: 'static-hero-3',
    title: 'Men Western Wear',
    subtitle: 'Timeless pieces with modern appeal',
    cta: 'Shop Now',
    image: 'https://zarr.com.pk/cdn/shop/files/Men_Western_1.webp?v=1773120821',
  },
  {
    id: 'static-hero-4',
    title: 'Men Eastern Wear',
    subtitle: 'Premium fabrics and refined design',
    cta: 'Shop Now',
    image: 'https://zarr.com.pk/cdn/shop/files/Eastern_Mobile_a0ed76f7-d854-4820-ac03-22ad124bdb54_2.webp?v=1773121283',
  },
];

const getPremiumCollectionLifestyle = (collection: Collection, index: number) => {
  const title = String(collection.title || '').toLowerCase();
  const id = String(collection.id || '').toLowerCase();
  
  if (title.includes('men') || id.includes('men')) {
    if (title.includes('western') || id.includes('western')) {
      return 'https://zarr.com.pk/cdn/shop/files/Men_Western_1.webp?v=1773120821';
    }
    return 'https://zarr.com.pk/cdn/shop/files/Eastern_Mobile_a0ed76f7-d854-4820-ac03-22ad124bdb54_2.webp?v=1773121283';
  }
  if (title.includes('kids') || id.includes('kids')) {
    return 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('women') || id.includes('women')) {
    if (title.includes('unstitched') || id.includes('unstitched')) {
      return 'https://zarr.com.pk/cdn/shop/files/m4.webp?v=1778246304';
    }
    return 'https://zarr.com.pk/cdn/shop/files/m3.webp?v=1778246304';
  }
  
  const fallbacks = [
    'https://zarr.com.pk/cdn/shop/files/m4.webp?v=1778246304',
    'https://zarr.com.pk/cdn/shop/files/m3.webp?v=1778246304',
    'https://zarr.com.pk/cdn/shop/files/Men_Western_1.webp?v=1773120821',
    'https://zarr.com.pk/cdn/shop/files/Eastern_Mobile_a0ed76f7-d854-4820-ac03-22ad124bdb54_2.webp?v=1773121283'
  ];
  return fallbacks[index % fallbacks.length];
};

const normalizeBanners = (
  feed: HomeFeedShape,
  collections: Collection[],
  products: Product[],
): HomeBanner[] => {
  if (collections && collections.length > 0) {
    const activeCollections = collections.filter(c => getCollectionImage(c));
    if (activeCollections.length > 0) {
      return activeCollections.slice(0, 4).map((c, index) => {
        const metaOptions = [
          { eyebrow: 'NEW ARRIVALS', subtitle: 'Discover our exclusive curated arrivals' },
          { eyebrow: 'SPRING EDIT', subtitle: 'Fresh silhouettes and polished details' },
          { eyebrow: 'LUXURY SELECTION', subtitle: 'Timeless pieces with modern appeal' },
          { eyebrow: 'ELEGANT STYLES', subtitle: 'Premium fabrics and refined designs' },
        ];
        const meta = metaOptions[index % metaOptions.length];
        return {
          id: `shopify-banner-${c.id}`,
          title: c.title,
          eyebrow: meta.eyebrow,
          subtitle: c.description || meta.subtitle,
          cta: 'Shop Now',
          image: getPremiumCollectionLifestyle(c, index),
          collectionId: c.id,
        };
      });
    }
  }
  return STATIC_HERO_BANNERS;
};

const FadeInSection = memo(
  ({
    children,
    delay = 0,
    style,
  }: {
    children: React.ReactNode;
    delay?: number;
    style?: StyleProp<ViewStyle>;
  }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, [delay, opacity]);

    const translateY = opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 0],
    });

    return (
      <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
        {children}
      </Animated.View>
    );
  },
);

const AnnouncementBar = memo(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActiveIndex((current) => (current + 1) % PROMO_MESSAGES.length);
        translateY.setValue(10);
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 220,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 220,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3200);

    return () => clearInterval(timer);
  }, [opacity, translateY]);

  return (
    <View style={styles.announcementBar}>
      <Animated.Text
        numberOfLines={1}
        style={[
          styles.announcementText,
          { opacity, transform: [{ translateY }] },
        ]}
      >
        {PROMO_MESSAGES[activeIndex].toUpperCase()}
      </Animated.Text>
    </View>
  );
});

const ZarrHeader = memo(
  ({
    onMenuPress,
    onCartPress,
    onWishlistPress,
  }: {
    onMenuPress?: () => void;
    onCartPress?: () => void;
    onWishlistPress?: () => void;
  }) => {
    const { itemCount } = useCart();

    return (
      <View style={styles.header}>
        <Pressable hitSlop={12} style={styles.headerIcon} onPress={onMenuPress}>
          <Ionicons name="menu-outline" size={25} color="#050505" />
        </Pressable>

        <View pointerEvents="none" style={styles.logoWrap}>
          <Text style={styles.logoGlyph}>Z</Text>
          <Text style={styles.logoText}>ZARR</Text>
        </View>

        <View style={styles.headerRight}>
          <Pressable hitSlop={10} style={styles.headerIcon}>
            <Ionicons name="search-outline" size={21} color="#050505" />
          </Pressable>
          <Pressable hitSlop={10} style={styles.headerIcon} onPress={onWishlistPress}>
            <Ionicons name="heart-outline" size={21} color="#050505" />
          </Pressable>
          <Pressable hitSlop={10} style={styles.headerIcon} onPress={onCartPress}>
            <Ionicons name="bag-outline" size={21} color="#050505" />
            {itemCount > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {itemCount > 9 ? '9+' : itemCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>
    );
  },
);

const SectionTitle = memo(
  ({
    title,
    subtitle,
    align = 'center',
  }: {
    title: string;
    subtitle?: string;
    align?: 'center' | 'left';
  }) => (
    <View
      style={[
        styles.sectionTitleWrap,
        align === 'left' && styles.sectionTitleWrapLeft,
      ]}
    >
      <Text style={[styles.sectionTitle, align === 'left' && styles.textLeft]}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[styles.sectionSubtitle, align === 'left' && styles.textLeft]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  ),
);

// Local HeroCarousel removed in favor of shared robust HeroBanner component

const CategoryRail = memo(
  ({
    categories,
    onPress,
  }: {
    categories: CategoryItem[];
    onPress: (categoryId: string, title: string) => void;
  }) => {
    if (!categories.length) return null;

    return (
      <View style={styles.categorySection}>
        <SectionTitle title="Shop By Category" />
        <View style={styles.categoryTabs}>
          {categories.map((category, index) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryTab,
                index === 0 && styles.categoryTabActive,
              ]}
              onPress={() => onPress(category.id, category.title)}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  index === 0 && styles.categoryTabTextActive,
                ]}
              >
                {category.title}
              </Text>
            </Pressable>
          ))}
        </View>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoryRail}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.categoryItem,
                pressed && styles.pressedItem,
              ]}
              onPress={() => onPress(item.id, item.title)}
            >
              <View style={styles.categoryImageWrap}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.categoryImage} />
                ) : (
                  <Text style={styles.categoryInitial}>
                    {item.title.slice(0, 1).toUpperCase()}
                  </Text>
                )}
              </View>
              <Text style={styles.categoryLabel} numberOfLines={2}>
                {item.title}
              </Text>
            </Pressable>
          )}
        />
      </View>
    );
  },
);



const ProductTile = memo(
  ({
    product,
    width,
    onPress,
  }: {
    product: Product;
    width: number;
    onPress?: () => void;
  }) => {
    const [liked, setLiked] = useState(false);
    const pressScale = useRef(new Animated.Value(1)).current;
    const heartScale = useRef(new Animated.Value(1)).current;

    const animatePress = useCallback(
      (toValue: number) => {
        Animated.spring(pressScale, {
          toValue,
          useNativeDriver: true,
          friction: 8,
          tension: 90,
        }).start();
      },
      [pressScale],
    );

    const toggleWishlist = useCallback(() => {
      setLiked((current) => !current);
      Animated.sequence([
        Animated.spring(heartScale, {
          toValue: 1.22,
          useNativeDriver: true,
          friction: 5,
          tension: 120,
        }),
        Animated.spring(heartScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
          tension: 90,
        }),
      ]).start();
    }, [heartScale]);

    return (
      <Animated.View
        style={[styles.productOuter, { width, transform: [{ scale: pressScale }] }]}
      >
        <Pressable
          style={styles.productCard}
          onPress={onPress}
          onPressIn={() => animatePress(0.985)}
          onPressOut={() => animatePress(1)}
        >
          <View style={styles.productImageWrap}>
            {product.image ? (
              <Image source={{ uri: product.image }} style={styles.productImage} />
            ) : (
              <View style={styles.productPlaceholder}>
                <Text style={styles.productPlaceholderText}>ZARR</Text>
              </View>
            )}
            {product.discountPercent ? (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{product.discountPercent}%</Text>
              </View>
            ) : null}
            <Pressable
              hitSlop={10}
              style={styles.wishlistButton}
              onPress={toggleWishlist}
            >
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={18}
                  color={liked ? '#BA1D28' : '#111111'}
                />
              </Animated.View>
            </Pressable>

            {/* Quick Buy Overlay Button */}
            <Pressable style={styles.quickBuyBtn}>
              <Ionicons name="cart-outline" size={15} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.productMeta}>
            <Text style={styles.productBrand} numberOfLines={1}>
              {String(product.brand || 'ZARR SELECT').toUpperCase()}
            </Text>
            <Text style={styles.productTitle} numberOfLines={2}>
              {String(product.title).toUpperCase()}
            </Text>
            <View style={styles.priceRow}>
              <Text
                style={[
                  styles.productPrice,
                  product.originalPrice ? styles.productSalePrice : null,
                ]}
              >
                {formatPrice(product.price)}
              </Text>
              {product.originalPrice ? (
                <Text style={styles.productComparePrice}>
                  {formatPrice(product.originalPrice)}
                </Text>
              ) : null}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  },
);

const ProductRail = memo(
  ({
    title,
    subtitle,
    products,
    cardWidth,
    snap = false,
    onProductPress,
    onSeeAllPress,
  }: {
    title: string;
    subtitle?: string;
    products: Product[];
    cardWidth: number;
    snap?: boolean;
    onProductPress: (productId: string) => void;
    onSeeAllPress?: () => void;
  }) => {
    const keyExtractor = useCallback((item: Product) => item.id, []);
    const itemGap = 12;

    const renderItem = useCallback(
      ({ item }: { item: Product }) => (
        <ProductTile
          product={item}
          width={cardWidth}
          onPress={() => onProductPress(item.id)}
        />
      ),
      [cardWidth, onProductPress],
    );

    if (!products.length) return null;

    return (
      <View style={styles.productRailSection}>
        <View style={styles.productHeader}>
          <View style={styles.productHeaderText}>
            <Text style={styles.productSectionTitle}>{title}</Text>
            {subtitle ? (
              <Text style={styles.productSectionSubtitle}>{subtitle}</Text>
            ) : null}
          </View>
          {onSeeAllPress ? (
            <Pressable style={styles.viewAllButton} onPress={onSeeAllPress}>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          ) : null}
        </View>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productRail}
          ItemSeparatorComponent={() => <View style={{ width: itemGap }} />}
          snapToInterval={snap ? cardWidth + itemGap : undefined}
          decelerationRate={snap ? 'fast' : 'normal'}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={5}
          removeClippedSubviews
          getItemLayout={(_, index) => ({
            length: cardWidth + itemGap,
            offset: (cardWidth + itemGap) * index,
            index,
          })}
        />
      </View>
    );
  },
);

const TabbedProductRail = memo(
  ({
    sectionTitle,
    tabs,
    cardWidth,
    onProductPress,
    onSeeAllPress,
  }: {
    sectionTitle: string;
    tabs: ProductTab[];
    cardWidth: number;
    onProductPress: (productId: string) => void;
    onSeeAllPress: (collectionId: string, title: string) => void;
  }) => {
    const [activeId, setActiveId] = useState(tabs[0]?.id);
    const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

    if (!active) return null;

    return (
      <View style={styles.tabbedRailSection}>
        <SectionTitle title={sectionTitle} />
        <View style={styles.productTabs}>
          {tabs.map((tab) => {
            const isActive = tab.id === active.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.productTab, isActive && styles.productTabActive]}
                onPress={() => setActiveId(tab.id)}
              >
                <Text
                  style={[
                    styles.productTabText,
                    isActive && styles.productTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <ProductRail
          title={active.title}
          subtitle={active.subtitle}
          products={active.products}
          cardWidth={cardWidth}
          onProductPress={onProductPress}
          onSeeAllPress={() => onSeeAllPress(active.collectionId, active.title)}
        />
      </View>
    );
  },
);

const NewArrivalsGrid = memo(
  ({
    products,
    cardWidth,
    onProductPress,
  }: {
    products: Product[];
    cardWidth: number;
    onProductPress: (productId: string) => void;
  }) => {
    if (!products.length) return null;

    return (
      <View style={styles.gridSection}>
        <SectionTitle
          title="New Arrivals"
          subtitle="Fresh silhouettes, polished details, and latest drops."
        />
        <View style={styles.productGrid}>
          {products.slice(0, 8).map((product) => (
            <ProductTile
              key={product.id}
              product={product}
              width={cardWidth}
              onPress={() => onProductPress(product.id)}
            />
          ))}
        </View>
      </View>
    );
  },
);

const CampaignBanner = memo(
  ({
    collection,
    width,
    index,
    onPress,
  }: {
    collection?: Collection;
    width: number;
    index: number;
    onPress: (collectionId: string, title: string) => void;
  }) => {
    if (!collection) return null;

    const image = getCollectionImage(collection);
    if (!image) return null;

    const height = Math.max(250, Math.min(330, Math.round(width * 0.78)));

    return (
      <Pressable
        style={({ pressed }) => [
          styles.campaignWrap,
          { height },
          pressed && styles.pressedItem,
        ]}
        onPress={() => onPress(collection.id, collection.title)}
      >
        <ImageBackground
          source={{ uri: image }}
          style={styles.campaignImage}
          imageStyle={styles.campaignImageStyle}
        >
          <View style={styles.campaignOverlay} />
          <View style={styles.campaignCopy}>
            <Text style={styles.campaignEyebrow}>
              {index % 2 === 0 ? 'NEW CAMPAIGN' : 'FASHION DROP'}
            </Text>
            <Text style={styles.campaignTitle} numberOfLines={2}>
              {collection.title}
            </Text>
            {collection.description ? (
              <Text style={styles.campaignSubtitle} numberOfLines={2}>
                {collection.description}
              </Text>
            ) : null}
            <Text style={styles.campaignCta}>SHOP THE EDIT</Text>
          </View>
        </ImageBackground>
      </Pressable>
    );
  },
);

const OffersJustForYou = memo(() => {
  const offers = [
    {
      icon: 'card-outline' as IconName,
      title: 'JAZZCASH 30% OFF',
      desc: 'Save up to Rs. 3,000 on mobile wallet checkout.',
      badge: 'PROMO',
    },
    {
      icon: 'swap-horizontal-outline' as IconName,
      title: 'FREE & EASY RETURNS',
      desc: '14-day hassle-free exchange & return policy.',
      badge: 'SECURE',
    },
    {
      icon: 'gift-outline' as IconName,
      title: 'FRIDAY SPOTLIGHT',
      desc: 'Free nationwide shipping on all Friday orders.',
      badge: 'SHIPPING',
    },
    {
      icon: 'sparkles-outline' as IconName,
      title: 'EXCLUSIVE DROPS',
      desc: 'First access to premium luxury designer items.',
      badge: 'LIMITED',
    },
  ];

  return (
    <View style={styles.offersContainer}>
      <SectionTitle title="Offers Just For You" />
      <View style={styles.offersGrid}>
        {offers.map((offer) => (
          <View key={offer.title} style={styles.offerCard}>
            <View style={styles.offerBadge}>
              <Text style={styles.offerBadgeText}>{offer.badge}</Text>
            </View>
            <View style={styles.offerIconWrap}>
              <Ionicons name={offer.icon} size={24} color="#B7984A" />
            </View>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <Text style={styles.offerDesc}>{offer.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const BrandMoodBoard = memo(() => {
  const items = [
    {
      image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=600&q=80',
      tag: 'WESTERN SHIRT',
    },
    {
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      tag: 'STREET EDIT',
    },
    {
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
      tag: 'EASTERN CHIC',
    },
    {
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
      tag: 'COUTURÈ',
    },
  ];

  return (
    <View style={styles.moodBoardContainer}>
      <SectionTitle title="Brand Mood Board" />
      <View style={styles.moodBoardGrid}>
        {items.map((item, idx) => (
          <View key={idx} style={styles.moodBoardItem}>
            <Image source={{ uri: item.image }} style={styles.moodBoardImage} />
            <View style={styles.moodBoardOverlay} />
            <Text style={styles.moodBoardTag}>{item.tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const LuxuryFooter = memo(() => {
  const [email, setEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const handleLinkPress = (link: string) => {
    switch (link) {
      case 'FAQs':
        Linking.openURL('https://zarr.com.pk/pages/faqs').catch((err) =>
          console.error("Couldn't load page", err),
        );
        break;
      case 'Contact Us':
        Linking.openURL('https://zarr.com.pk/pages/help').catch((err) =>
          console.error("Couldn't load page", err),
        );
        break;
      case 'Track Order':
        Linking.openURL('https://zarr.com.pk/pages/track-order').catch((err) =>
          console.error("Couldn't load page", err),
        );
        break;
      case 'Delivery, Return & Exchange Policy':
        Linking.openURL('https://zarr.com.pk/policies/refund-policy').catch((err) =>
          console.error("Couldn't load page", err),
        );
        break;
      case 'Terms & Conditions':
        Linking.openURL('https://zarr.com.pk/policies/terms-of-service').catch((err) =>
          console.error("Couldn't load page", err),
        );
        break;
      case 'Privacy Policy':
        Linking.openURL('https://zarr.com.pk/policies/privacy-policy').catch((err) =>
          console.error("Couldn't load page", err),
        );
        break;
      case 'About Us':
        Linking.openURL('https://zarr.com.pk/pages/about-us').catch((err) =>
          console.error("Couldn't load page", err),
        );
        break;
      case 'Partner with Us':
        Linking.openURL('https://zarr.com.pk/pages/join-us').catch((err) =>
          console.error("Couldn't load page", err),
        );
        break;
      default:
        Linking.openURL('https://zarr.com.pk/').catch((err) =>
          console.error("Couldn't load page", err),
        );
    }
  };

  const handleSocialPress = (iconName: string) => {
    let url = 'https://zarr.com.pk/';
    if (iconName === 'logo-instagram') {
      url = 'https://www.instagram.com/zarr.official/';
    } else if (iconName === 'logo-tiktok') {
      url = 'https://www.tiktok.com/@itszarrofficial?lang=en';
    } else if (iconName === 'logo-pinterest') {
      url = 'https://www.pinterest.com/zarrofficial/';
    } else if (iconName === 'logo-facebook') {
      url = 'https://www.facebook.com/zarr.official1';
    } else if (iconName === 'logo-youtube') {
      url = 'https://www.youtube.com/@ItsZarrOfficial';
    } else if (iconName === 'logo-linkedin') {
      url = 'https://www.linkedin.com/company/zarrofficial/';
    }
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  const instagramImages = [
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=400&q=80',
  ];

  return (
    <View style={styles.footer}>
      {/* Instagram Block */}
      <View style={styles.instaContainer}>
        <Text style={styles.instaTitle}>#ZARRSTYLE ON INSTAGRAM</Text>
        <View style={styles.instaGrid}>
          {instagramImages.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.instaImage} />
          ))}
        </View>
      </View>

      <View style={styles.footerBrandWrap}>
        <Text style={styles.footerLogo}>ZARR</Text>
        <Text style={styles.footerTagline}>PAKISTAN'S FINEST FASHION</Text>
      </View>

      {/* Expandable Accordions */}
      <View style={styles.accordionContainer}>
        {/* Help Accordion */}
        <Pressable style={styles.accordionHeader} onPress={() => toggleSection('help')}>
          <Text style={styles.accordionTitle}>HELP & INFORMATION</Text>
          <Ionicons
            name={expandedSection === 'help' ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={16}
            color="#FFFFFF"
          />
        </Pressable>
        {expandedSection === 'help' && (
          <View style={styles.accordionContent}>
            {HELP_LINKS.map((link) => (
              <Pressable key={link} onPress={() => handleLinkPress(link)}>
                <Text style={styles.footerLink}>
                  {link}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* About Accordion */}
        <Pressable style={styles.accordionHeader} onPress={() => toggleSection('about')}>
          <Text style={styles.accordionTitle}>ABOUT ZARR</Text>
          <Ionicons
            name={expandedSection === 'about' ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={16}
            color="#FFFFFF"
          />
        </Pressable>
        {expandedSection === 'about' && (
          <View style={styles.accordionContent}>
            {ABOUT_LINKS.map((link) => (
              <Pressable key={link} onPress={() => handleLinkPress(link)}>
                <Text style={styles.footerLink}>
                  {link}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Newsletter Container */}
      <View style={styles.newsletter}>
        <Text style={styles.newsletterTitle}>LET'S BE EMAIL FRIENDS</Text>
        <Text style={styles.newsletterCopy}>
          Exclusive deals, insider updates, and first looks at new drops.{"\n"}No clutter. Just curated goodness.
        </Text>
        <View style={styles.newsletterInputWrap}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email address"
            placeholderTextColor="#777777"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.newsletterInput}
          />
          <Pressable style={styles.newsletterButton}>
            <Text style={styles.newsletterButtonText}>Sign Up</Text>
          </Pressable>
        </View>

        {/* Gold Terms Checkbox */}
        <Pressable style={styles.termsRow} onPress={() => setAgreeTerms(!agreeTerms)}>
          <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
            {agreeTerms && <Ionicons name="checkmark" size={10} color="#050505" />}
          </View>
          <Text style={styles.termsText}>
            I have read and agreed to the{" "}
            <Text
              style={{ textDecorationLine: 'underline', color: '#B7984A' }}
              onPress={() => handleLinkPress('Terms & Conditions')}
            >
              Terms and Conditions
            </Text>
            .
          </Text>
        </Pressable>
      </View>

      <Text style={styles.socialHeader}>FOLLOW US</Text>
      <View style={styles.socialRow}>
        {SOCIAL_ICONS.map((icon) => (
          <Pressable key={icon} onPress={() => handleSocialPress(icon)} style={styles.socialButton}>
            <Ionicons name={icon} size={17} color="#FFFFFF" />
          </Pressable>
        ))}
      </View>

      <Text style={styles.copyright}>© 2025 Jazz, All rights reserved</Text>
    </View>
  );
});

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { data, status, refresh } = useHomeFeed();
  const { data: liveCollections } = useCollections();
  const { isAuthenticated } = useAuth();
  const { width } = useWindowDimensions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const feed = data as HomeFeedShape;

  const goCollection = useCallback(
    (collectionId: string, title: string) =>
      navigation.navigate('Collection', { collectionId, title }),
    [navigation],
  );

  const goProduct = useCallback(
    (productId: string) => navigation.navigate('ProductDetail', { productId }),
    [navigation],
  );

  const goCart = useCallback(() => navigation.navigate('Cart'), [navigation]);

  const goAccount = useCallback(
    () =>
      isAuthenticated
        ? navigation.navigate('Account')
        : navigation.navigate('Login'),
    [isAuthenticated, navigation],
  );

  const collections = useMemo(() => {
    if (Array.isArray(feed.collections) && feed.collections.length) {
      return feed.collections;
    }
    if (liveCollections.length) return liveCollections;
    return [];
  }, [feed.collections, liveCollections]);

  const allFetchedProducts = useMemo(
    () =>
      dedupeProducts([
        ...(feed.featuredProducts ?? []),
        ...(feed.newArrivals ?? []),
        ...(feed.bestSellers ?? []),
        ...(feed.popularWomen ?? []),
        ...(feed.popularMen ?? []),
        ...(feed.saleWomen ?? []),
        ...(feed.saleMen ?? []),
      ]),
    [feed],
  );

  const featuredProducts = useMemo(
    () =>
      dedupeProducts(
        feed.featuredProducts?.length
          ? feed.featuredProducts
          : [...(feed.popularWomen ?? []), ...(feed.popularMen ?? [])],
      ).slice(0, 14),
    [feed.featuredProducts, feed.popularMen, feed.popularWomen],
  );

  const newArrivals = useMemo(
    () =>
      dedupeProducts(
        feed.newArrivals?.length
          ? feed.newArrivals
          : [
              ...(feed.popularWomen ?? []),
              ...(feed.popularMen ?? []),
              ...(feed.saleWomen ?? []),
            ],
      ).slice(0, 10),
    [feed.newArrivals, feed.popularMen, feed.popularWomen, feed.saleWomen],
  );

  const bestSellers = useMemo(
    () =>
      dedupeProducts(
        feed.bestSellers?.length
          ? feed.bestSellers
          : [
              ...(feed.saleWomen ?? []),
              ...(feed.saleMen ?? []),
              ...(feed.popularWomen ?? []),
              ...(feed.popularMen ?? []),
            ],
      ).slice(0, 14),
    [
      feed.bestSellers,
      feed.popularMen,
      feed.popularWomen,
      feed.saleMen,
      feed.saleWomen,
    ],
  );

  const banners = useMemo(
    () => normalizeBanners(feed, collections, allFetchedProducts),
    [allFetchedProducts, collections, feed],
  );

  const popularTabs = useMemo<ProductTab[]>(
    () => [
      {
        id: 'women',
        label: 'Women',
        title: 'Shop Trendy Women Outfits',
        subtitle:
          "Trending looks, bold details, and fresh silhouettes everyone is loving.",
        products:
          feed.popularWomen?.length || !featuredProducts.length
            ? feed.popularWomen ?? []
            : featuredProducts,
        collectionId: 'women',
      },
      {
        id: 'men',
        label: 'Men',
        title: 'Shop Trendy Men Outfits',
        subtitle:
          'Laid-back essentials, tailored polish, and standout streetwear.',
        products:
          feed.popularMen?.length || !featuredProducts.length
            ? feed.popularMen ?? []
            : featuredProducts,
        collectionId: 'men',
      },
    ],
    [featuredProducts, feed.popularMen, feed.popularWomen],
  );

  const saleTabs = useMemo<ProductTab[]>(
    () => [
      {
        id: 'women',
        label: 'Women',
        title: 'Women On Sale',
        subtitle: 'Huge discounts on top women fashion lines.',
        products: feed.saleWomen?.length ? feed.saleWomen : bestSellers,
        collectionId: 'women',
      },
      {
        id: 'men',
        label: 'Men',
        title: 'Men On Sale',
        subtitle: 'Unmissable markdowns on men essentials.',
        products: feed.saleMen?.length ? feed.saleMen : bestSellers,
        collectionId: 'men',
      },
    ],
    [bestSellers, feed.saleMen, feed.saleWomen],
  );

  const railCardWidth = Math.min(184, Math.max(158, width * 0.44));
  const gridCardWidth = Math.floor((width - 36) / 2);
  const campaignCollections = collections.filter(getCollectionImage);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AnnouncementBar />
      <ZarrHeader
        onMenuPress={() => setIsMenuOpen(true)}
        onCartPress={goCart}
        onWishlistPress={goAccount}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={refresh}
            tintColor="#111111"
          />
        }
      >
        {status === 'loading' ? (
          <View style={styles.loadingBar}>
            <ActivityIndicator size="small" color="#111111" />
          </View>
        ) : null}

        {/* Premium Search Bar */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBarInner}>
            <Ionicons name="search-outline" size={18} color="#777777" style={styles.searchIcon} />
            <TextInput
              placeholder="Search brands, style, categories..."
              placeholderTextColor="#777777"
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <HeroBanner
          banners={banners}
          onPress={goCollection}
        />

        <FadeInSection delay={40}>
          <ShopByType onPress={goCollection} />
        </FadeInSection>

        <FadeInSection delay={80}>
          <FeaturedCollections onPress={goCollection} />
        </FadeInSection>

        <FadeInSection delay={120}>
          <TabbedProductRail
            sectionTitle="Popular Right Now"
            tabs={popularTabs}
            cardWidth={railCardWidth}
            onProductPress={goProduct}
            onSeeAllPress={goCollection}
          />
        </FadeInSection>

        <FadeInSection delay={160}>
          <TabbedProductRail
            sectionTitle="On Sale Right Now"
            tabs={saleTabs}
            cardWidth={railCardWidth}
            onProductPress={goProduct}
            onSeeAllPress={goCollection}
          />
        </FadeInSection>

        <FadeInSection delay={200}>
          <View style={styles.featuredBrandSection}>
            <SectionTitle
              title="Featured Brands"
              subtitle="Discover premium labels and curated designers available on ZARR."
            />
            <FeaturedBrands onPress={(brandName) => goCollection(brandName.toLowerCase(), brandName)} />

            {/* Landscape Promo Banner */}
            <Pressable
              style={styles.promoBannerContainer}
              onPress={() => goCollection('all-products', '50,000+ Products')}
            >
              <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80' }}
                style={styles.promoBannerBg}
                imageStyle={styles.promoBannerImg}
              >
                <View style={styles.promoBannerOverlay} />
                <View style={styles.promoBannerContent}>
                  <Text style={styles.promoBannerEyebrow}>SEASONAL FOCUS</Text>
                  <Text style={styles.promoBannerTitle}>BUY OVER 50,000+ PRODUCTS</Text>
                  <Text style={styles.promoBannerSubtitle}>Pakistan's largest designer fashion catalogue at your fingertips.</Text>
                  <View style={styles.promoBannerCta}>
                    <Text style={styles.promoBannerCtaText}>EXPLORE ALL</Text>
                  </View>
                </View>
              </ImageBackground>
            </Pressable>
          </View>
        </FadeInSection>

        <FadeInSection delay={240}>
          <OffersJustForYou />
        </FadeInSection>

        <FadeInSection delay={280}>
          <BrandMoodBoard />
        </FadeInSection>

        <LuxuryFooter />
      </ScrollView>

      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={(_type, id, title) => goCollection(id, title)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 0,
  },
  searchBarContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E6E6',
  },
  searchBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#111111',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    padding: 0,
  },
  loadingBar: {
    height: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  announcementBar: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050505',
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  announcementText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9,
    letterSpacing: 1.1,
    textAlign: 'center',
  },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E6E6',
    zIndex: 10,
    elevation: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    minWidth: 108,
  },
  headerIcon: {
    width: 34,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  logoGlyph: {
    color: '#B7984A',
    fontFamily: 'PlayfairDisplay_700Bold_Italic',
    fontSize: 24,
    lineHeight: 28,
    transform: [{ rotate: '-9deg' }],
  },
  logoText: {
    color: '#111111',
    fontFamily: 'Inter_500Medium',
    fontSize: 22,
    letterSpacing: 5,
  },
  cartBadge: {
    position: 'absolute',
    top: 7,
    right: 4,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    backgroundColor: '#050505',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
  },
  sectionTitleWrap: {
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  sectionTitleWrapLeft: {
    alignItems: 'flex-start',
  },
  sectionTitle: {
    color: '#111111',
    fontFamily: 'Inter_500Medium',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: 'center',
  },
  sectionSubtitle: {
    color: '#666666',
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    textAlign: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  categorySection: {
    paddingTop: 28,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
  },
  categoryTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 22,
    paddingHorizontal: 16,
  },
  categoryTab: {
    minWidth: 92,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#DADADA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  categoryTabActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  categoryTabText: {
    color: '#111111',
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  categoryRail: {
    paddingHorizontal: 14,
    gap: 14,
  },
  categoryItem: {
    width: 78,
    alignItems: 'center',
  },
  categoryImageWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#F5F5F5',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryInitial: {
    color: '#111111',
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
  },
  categoryLabel: {
    color: '#111111',
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  pressedItem: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  featuredCollectionsSection: {
    paddingTop: 4,
    paddingBottom: 34,
    backgroundColor: '#FFFFFF',
  },
  collectionRail: {
    paddingHorizontal: 14,
    gap: 12,
  },
  collectionCard: {
    width: 184,
    height: 246,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#F3F3F3',
  },
  collectionImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  collectionImageStyle: {
    resizeMode: 'cover',
  },
  collectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  collectionCopy: {
    padding: 13,
  },
  collectionBrand: {
    color: 'rgba(255,255,255,0.82)',
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  collectionTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    lineHeight: 21,
  },
  tabbedRailSection: {
    paddingBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  featuredBrandSection: {
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
  },
  productTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: -2,
    marginBottom: 12,
  },
  productTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  productTabActive: {
    borderBottomColor: '#111111',
  },
  productTabText: {
    color: '#707070',
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  productTabTextActive: {
    color: '#111111',
    fontFamily: 'Inter_700Bold',
  },
  productRailSection: {
    paddingTop: 8,
    paddingBottom: 34,
    backgroundColor: '#FFFFFF',
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  productHeaderText: {
    flex: 1,
  },
  productSectionTitle: {
    color: '#111111',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    lineHeight: 25,
  },
  productSectionSubtitle: {
    color: '#6E6E6E',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  viewAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#111111',
  },
  viewAllText: {
    color: '#111111',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  productRail: {
    paddingHorizontal: 14,
    paddingBottom: 2,
  },
  productOuter: {
    backgroundColor: '#FFFFFF',
  },
  productCard: {
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E7E7E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  productImageWrap: {
    width: '100%',
    aspectRatio: 0.72,
    overflow: 'hidden',
    backgroundColor: '#F2F2F2',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F3F3',
  },
  productPlaceholderText: {
    color: '#111111',
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    letterSpacing: 4,
  },
  discountBadge: {
    position: 'absolute',
    top: 9,
    left: 9,
    minWidth: 42,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#111111',
    borderRadius: 2,
  },
  discountText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  quickBuyBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  productMeta: {
    paddingHorizontal: 9,
    paddingTop: 10,
    paddingBottom: 12,
    minHeight: 96,
  },
  productBrand: {
    color: '#777777',
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  productTitle: {
    color: '#111111',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
    minHeight: 32,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  productPrice: {
    color: '#111111',
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
  },
  productSalePrice: {
    color: '#B00020',
  },
  productComparePrice: {
    color: '#898989',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  campaignWrap: {
    marginHorizontal: 14,
    marginTop: 4,
    marginBottom: 38,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
  },
  campaignImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  campaignImageStyle: {
    resizeMode: 'cover',
  },
  campaignOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  campaignCopy: {
    paddingHorizontal: 18,
    paddingBottom: 22,
  },
  campaignEyebrow: {
    color: 'rgba(255,255,255,0.82)',
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 8,
  },
  campaignTitle: {
    color: '#FFFFFF',
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 31,
    lineHeight: 36,
  },
  campaignSubtitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  campaignCta: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 1.5,
    marginTop: 18,
  },
  gridSection: {
    paddingTop: 0,
    paddingBottom: 34,
    backgroundColor: '#FFFFFF',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
    paddingHorizontal: 12,
  },
  offersSection: {
    paddingTop: 0,
    paddingBottom: 36,
    backgroundColor: '#FFFFFF',
  },
  offerRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
  },
  offerItem: {
    flex: 1,
    minHeight: 82,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 8,
  },
  offerText: {
    color: '#111111',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 8,
  },
  promoBannerContainer: {
    height: 180,
    marginTop: 18,
    borderRadius: 8,
    overflow: 'hidden',
  },
  promoBannerBg: {
    flex: 1,
    justifyContent: 'center',
  },
  promoBannerImg: {
    resizeMode: 'cover',
  },
  promoBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  promoBannerContent: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  promoBannerEyebrow: {
    color: '#B7984A',
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 2,
  },
  promoBannerTitle: {
    color: '#FFFFFF',
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  promoBannerSubtitle: {
    color: '#EAEAEA',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  promoBannerCta: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  promoBannerCtaText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1,
  },
  offersContainer: {
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6E6E6',
  },
  offersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
  },
  offerCard: {
    width: '48%',
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  offerBadgeText: {
    fontFamily: 'Inter_700Bold',
    color: '#333333',
    fontSize: 7,
    letterSpacing: 0.5,
  },
  offerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  offerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: '#111111',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  offerDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 12,
  },
  moodBoardContainer: {
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6E6E6',
  },
  moodBoardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
  },
  moodBoardItem: {
    width: '48%',
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  moodBoardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  moodBoardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  moodBoardTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  footer: {
    backgroundColor: '#050505',
    paddingHorizontal: 18,
    paddingTop: 34,
    paddingBottom: 30,
  },
  instaContainer: {
    marginBottom: 30,
  },
  instaTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 14,
  },
  instaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  instaImage: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 4,
    backgroundColor: '#1E1E1E',
  },
  footerBrandWrap: {
    alignItems: 'center',
    marginBottom: 26,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#262626',
    paddingBottom: 20,
  },
  footerLogo: {
    color: '#FFFFFF',
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    letterSpacing: 7,
  },
  footerTagline: {
    color: '#B7984A', // Golden branding tagline
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    letterSpacing: 2,
    marginTop: 6,
  },
  accordionContainer: {
    marginBottom: 24,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#262626',
  },
  accordionTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 1.2,
  },
  accordionContent: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  footerLink: {
    color: '#BFBFBF',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 28,
  },
  newsletter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#262626',
    paddingVertical: 22,
    marginBottom: 22,
  },
  newsletterTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 1.4,
  },
  newsletterCopy: {
    color: '#C9C9C9',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 14,
  },
  newsletterInputWrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#555555',
    height: 44,
    backgroundColor: '#FFFFFF',
  },
  newsletterInput: {
    flex: 1,
    color: '#111111',
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    paddingHorizontal: 12,
  },
  newsletterButton: {
    minWidth: 94,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderLeftColor: '#E6E6E6',
  },
  newsletterButtonText: {
    color: '#111111',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#B7984A', // Elegant gold checkbox outline
    borderRadius: 2,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#B7984A',
  },
  termsText: {
    color: '#999999',
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
  socialHeader: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#565656',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyright: {
    color: '#666666',
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    textAlign: 'center',
    paddingTop: 4,
  },
});
