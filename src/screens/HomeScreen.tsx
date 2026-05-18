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
import {
  categories as fallbackCategories,
  featuredCollections as fallbackCollections,
  formatPrice,
} from '../data';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  useCategoryShortcuts,
  useCollections,
  useHomeFeed,
} from '../hooks/useProducts';
import type { HomeScreenProps } from '../types/navigation';
import type { CategoryCard, Collection, Product } from '../types';
import { SideMenu } from '../components/SideMenu';

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

const normalizeBanners = (
  feed: HomeFeedShape,
  collections: Collection[],
  products: Product[],
): HomeBanner[] => {
  const rawBanners = Array.isArray(feed.banners) ? feed.banners : [];

  const fromFeed = rawBanners
    .map((banner, index) => {
      const image = firstString(
        banner.mobileImage,
        banner.image,
        banner.bannerImage,
        banner.desktopImage,
      );
      if (!image) return null;

      return {
        id: firstString(banner.id, banner.handle, `banner-${index}`),
        title: firstString(banner.title, banner.headline, 'ZARR'),
        subtitle: firstString(banner.subtitle, banner.description),
        cta: firstString(banner.cta, banner.buttonText, 'Shop Now'),
        image,
        collectionId: firstString(banner.collectionId, banner.handle),
      };
    })
    .filter(Boolean) as HomeBanner[];

  if (fromFeed.length) return fromFeed;

  const fromCollections = collections
    .map((collection, index) => {
      const image = getCollectionImage(collection);
      if (!image) return null;

      return {
        id: `collection-banner-${collection.id || index}`,
        title: collection.title,
        subtitle: collection.description,
        cta: 'Shop Now',
        image,
        collectionId: collection.id,
      };
    })
    .filter(Boolean) as HomeBanner[];

  if (fromCollections.length) return fromCollections.slice(0, 5);

  return products
    .filter((product) => product.image)
    .slice(0, 4)
    .map((product) => ({
      id: `product-banner-${product.id}`,
      title: product.title,
      subtitle: product.brand,
      cta: 'Shop Now',
      image: product.image,
      collectionId: product.collectionId,
    }));
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

const HeroCarousel = memo(
  ({
    banners,
    width,
    onCollectionPress,
  }: {
    banners: HomeBanner[];
    width: number;
    onCollectionPress: (collectionId: string, title: string) => void;
  }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const listRef = useRef<FlatList<HomeBanner>>(null);
    const activeRef = useRef(0);
    const heroHeight = Math.max(390, Math.min(470, Math.round(width * 1.14)));

    const updateActive = useCallback((index: number) => {
      activeRef.current = index;
      setActiveIndex(index);
    }, []);

    useEffect(() => {
      if (banners.length < 2) return undefined;

      const timer = setInterval(() => {
        const next = (activeRef.current + 1) % banners.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        updateActive(next);
      }, 4200);

      return () => clearInterval(timer);
    }, [banners.length, updateActive]);

    const onMomentumScrollEnd = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const next = Math.round(event.nativeEvent.contentOffset.x / width);
        updateActive(Math.max(0, Math.min(next, banners.length - 1)));
      },
      [banners.length, updateActive, width],
    );

    const renderHero = useCallback(
      ({ item }: { item: HomeBanner }) => (
        <Pressable
          style={[styles.heroSlide, { width, height: heroHeight }]}
          onPress={() =>
            item.collectionId
              ? onCollectionPress(item.collectionId, item.title)
              : undefined
          }
        >
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            <View style={styles.heroDimTop} />
            <View style={styles.heroDimBottom} />
            <View style={styles.heroCopy}>
              <Text style={styles.heroEyebrow}>ZARR EDIT</Text>
              <Text style={styles.heroTitle} numberOfLines={3}>
                {item.title}
              </Text>
              {item.subtitle ? (
                <Text style={styles.heroSubtitle} numberOfLines={2}>
                  {item.subtitle}
                </Text>
              ) : null}
              <View style={styles.heroCta}>
                <Text style={styles.heroCtaText}>{item.cta.toUpperCase()}</Text>
              </View>
            </View>
          </ImageBackground>
        </Pressable>
      ),
      [heroHeight, onCollectionPress, width],
    );

    if (!banners.length) return null;

    return (
      <View style={styles.heroWrap}>
        <FlatList
          ref={listRef}
          data={banners}
          renderItem={renderHero}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          decelerationRate="fast"
          onMomentumScrollEnd={onMomentumScrollEnd}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScrollToIndexFailed={({ index }) =>
            listRef.current?.scrollToOffset({
              offset: index * width,
              animated: true,
            })
          }
        />
        {banners.length > 1 ? (
          <View style={styles.heroDots}>
            {banners.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.heroDot,
                  activeIndex === index && styles.heroDotActive,
                ]}
              />
            ))}
          </View>
        ) : null}
      </View>
    );
  },
);

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
          {fallbackCategories.map((category, index) => (
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

const FeaturedCollectionsRail = memo(
  ({
    collections,
    onPress,
  }: {
    collections: Collection[];
    onPress: (collectionId: string, title: string) => void;
  }) => {
    const visibleCollections = collections.filter((collection) =>
      firstString(collection.image, collection.bannerImage),
    );

    if (!visibleCollections.length) return null;

    return (
      <View style={styles.featuredCollectionsSection}>
        <SectionTitle title="Featured Collections" />
        <FlatList
          data={visibleCollections}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.collectionRail}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={4}
          removeClippedSubviews
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.collectionCard,
                pressed && styles.pressedItem,
              ]}
              onPress={() => onPress(item.id, item.title)}
            >
              <ImageBackground
                source={{ uri: firstString(item.image, item.bannerImage) }}
                style={styles.collectionImage}
                imageStyle={styles.collectionImageStyle}
              >
                <View style={styles.collectionOverlay} />
                <View style={styles.collectionCopy}>
                  {item.brand ? (
                    <Text style={styles.collectionBrand} numberOfLines={1}>
                      {item.brand}
                    </Text>
                  ) : null}
                  <Text style={styles.collectionTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              </ImageBackground>
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
          </View>

          <View style={styles.productMeta}>
            {product.brand ? (
              <Text style={styles.productBrand} numberOfLines={1}>
                {product.brand}
              </Text>
            ) : null}
            <Text style={styles.productTitle} numberOfLines={2}>
              {product.title}
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
    tabs,
    cardWidth,
    onProductPress,
    onSeeAllPress,
  }: {
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
        <SectionTitle title="Popular Right Now" />
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

const OffersStrip = memo(() => {
  const offers = [
    { icon: 'sparkles-outline' as IconName, title: 'Exclusive Drops' },
    { icon: 'refresh-outline' as IconName, title: 'Easy Returns' },
    { icon: 'cube-outline' as IconName, title: 'Free Shipping' },
  ];

  return (
    <View style={styles.offersSection}>
      <SectionTitle title="Offers Just For You" />
      <View style={styles.offerRow}>
        {offers.map((offer) => (
          <View key={offer.title} style={styles.offerItem}>
            <Ionicons name={offer.icon} size={20} color="#111111" />
            <Text style={styles.offerText}>{offer.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const LuxuryFooter = memo(() => {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.footer}>
      <View style={styles.footerBrandWrap}>
        <Text style={styles.footerLogo}>ZARR</Text>
        <Text style={styles.footerTagline}>PAKISTAN'S FINEST FASHION</Text>
      </View>

      <View style={styles.newsletter}>
        <Text style={styles.newsletterTitle}>LET'S BE EMAIL FRIENDS</Text>
        <Text style={styles.newsletterCopy}>
          Exclusive deals, insider updates, and first looks at new drops.
        </Text>
        <View style={styles.newsletterInputWrap}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email*"
            placeholderTextColor="#777777"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.newsletterInput}
          />
          <Pressable style={styles.newsletterButton}>
            <Text style={styles.newsletterButtonText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footerLinksWrap}>
        <View style={styles.footerLinkColumn}>
          <Text style={styles.footerHeading}>Help & Information</Text>
          {HELP_LINKS.map((link) => (
            <Text key={link} style={styles.footerLink}>
              {link}
            </Text>
          ))}
        </View>
        <View style={styles.footerLinkColumn}>
          <Text style={styles.footerHeading}>About ZARR</Text>
          {ABOUT_LINKS.map((link) => (
            <Text key={link} style={styles.footerLink}>
              {link}
            </Text>
          ))}
        </View>
      </View>

      <Text style={styles.footerHeading}>Follow us</Text>
      <View style={styles.socialRow}>
        {SOCIAL_ICONS.map((icon) => (
          <Pressable key={icon} style={styles.socialButton}>
            <Ionicons name={icon} size={17} color="#FFFFFF" />
          </Pressable>
        ))}
      </View>

      <Text style={styles.copyright}>2025 ZARR. All rights reserved.</Text>
    </View>
  );
});

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { data, status, refresh } = useHomeFeed();
  const { data: liveCollections } = useCollections();
  const { data: shortcutData } = useCategoryShortcuts();
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
    return fallbackCollections;
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

  const categories = useMemo<CategoryItem[]>(() => {
    if (shortcutData.length) {
      return shortcutData.map((item) => ({
        id: item.handle,
        title: item.label,
        image: item.image,
      }));
    }

    const collectionCategories = collections
      .filter((collection) => collection.image)
      .slice(0, 10)
      .map((collection) => ({
        id: collection.id,
        title: collection.title,
        image: collection.image,
      }));

    if (collectionCategories.length) return collectionCategories;

    return fallbackCategories.map((category: CategoryCard) => ({
      id: category.id,
      title: category.title,
      image: category.image,
    }));
  }, [collections, shortcutData]);

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

        <HeroCarousel
          banners={banners}
          width={width}
          onCollectionPress={goCollection}
        />

        <FadeInSection delay={40}>
          <CategoryRail categories={categories} onPress={goCollection} />
        </FadeInSection>

        <FadeInSection delay={80}>
          <FeaturedCollectionsRail
            collections={collections}
            onPress={goCollection}
          />
        </FadeInSection>

        <FadeInSection delay={120}>
          <TabbedProductRail
            tabs={popularTabs}
            cardWidth={railCardWidth}
            onProductPress={goProduct}
            onSeeAllPress={goCollection}
          />
        </FadeInSection>

        <FadeInSection delay={160}>
          <CampaignBanner
            collection={campaignCollections[0]}
            width={width}
            index={0}
            onPress={goCollection}
          />
        </FadeInSection>

        <FadeInSection delay={200}>
          <NewArrivalsGrid
            products={newArrivals}
            cardWidth={gridCardWidth}
            onProductPress={goProduct}
          />
        </FadeInSection>

        <FadeInSection delay={240}>
          <CampaignBanner
            collection={campaignCollections[1] ?? campaignCollections[0]}
            width={width}
            index={1}
            onPress={goCollection}
          />
        </FadeInSection>

        <FadeInSection delay={280}>
          <ProductRail
            title="Best Sellers"
            subtitle="Customer-loved fashion finds from the ZARR marketplace."
            products={bestSellers}
            cardWidth={railCardWidth}
            snap
            onProductPress={goProduct}
            onSeeAllPress={() => goCollection('best-sellers', 'Best Sellers')}
          />
        </FadeInSection>

        <FadeInSection delay={320}>
          <OffersStrip />
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
  heroWrap: {
    backgroundColor: '#FFFFFF',
  },
  heroSlide: {
    backgroundColor: '#F4F4F4',
  },
  heroImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  heroDimTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  heroDimBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '58%',
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  heroCopy: {
    paddingHorizontal: 22,
    paddingBottom: 36,
    width: '86%',
  },
  heroEyebrow: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 2.4,
    marginBottom: 9,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    lineHeight: 39,
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  heroSubtitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
    opacity: 0.95,
  },
  heroCta: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.72)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroCtaText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  heroDots: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  heroDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.58)',
  },
  heroDotActive: {
    width: 22,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: 'rgba(0,0,0,0.22)',
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
    backgroundColor: 'rgba(0,0,0,0.36)',
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
  footer: {
    backgroundColor: '#050505',
    paddingHorizontal: 18,
    paddingTop: 34,
    paddingBottom: 30,
  },
  footerBrandWrap: {
    alignItems: 'center',
    marginBottom: 26,
  },
  footerLogo: {
    color: '#FFFFFF',
    fontFamily: 'Inter_500Medium',
    fontSize: 28,
    letterSpacing: 7,
  },
  footerTagline: {
    color: '#BBBBBB',
    fontFamily: 'Inter_500Medium',
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 8,
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#555555',
    height: 44,
  },
  newsletterInput: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    paddingHorizontal: 12,
  },
  newsletterButton: {
    minWidth: 94,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  newsletterButtonText: {
    color: '#111111',
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
  },
  footerLinksWrap: {
    flexDirection: 'row',
    gap: 22,
    marginBottom: 22,
  },
  footerLinkColumn: {
    flex: 1,
  },
  footerHeading: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  footerLink: {
    color: '#BFBFBF',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 22,
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
    color: '#888888',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textAlign: 'center',
    paddingTop: 4,
  },
});
