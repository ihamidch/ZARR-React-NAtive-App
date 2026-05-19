import React, { useRef, useState, useEffect } from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
} from 'react-native';
import { colors, typography, spacing } from '../theme';

const { width } = Dimensions.get('window');

type Banner = {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  cta?: string;
  collectionId?: string;
};

type Props = {
  banners: Banner[];
  onPress?: (collectionId: string, title: string) => void;
};

export const HeroBanner = ({ banners, onPress }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const activeRef = useRef(0);

  const updateActive = (index: number) => {
    activeRef.current = index;
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      const nextIndex = (activeRef.current + 1) % banners.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      updateActive(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={banners}
        style={styles.flatList}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          updateActive(Math.max(0, Math.min(index, banners.length - 1)));
        }}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScrollToIndexFailed={({ index }) => {
          flatListRef.current?.scrollToOffset({
            offset: index * width,
            animated: true,
          });
        }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.slide}
            onPress={() =>
              onPress && item.collectionId
                ? onPress(item.collectionId, item.title)
                : undefined
            }
          >
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.bgImageContainer}
              imageStyle={styles.bgImage}
            >
              <View style={styles.overlayTop} />
              <View style={styles.overlayBottom} />

              <View style={styles.content}>
                <Text style={styles.eyebrow}>{item.eyebrow || 'ZARR EDIT'}</Text>
                <Text style={styles.title} numberOfLines={3}>{item.title}</Text>
                {item.subtitle ? (
                  <Text style={styles.subtitle} numberOfLines={2}>{item.subtitle}</Text>
                ) : null}
                {item.cta ? (
                  <View style={styles.ctaButton}>
                    <Text style={styles.ctaText}>{item.cta.toUpperCase()}</Text>
                  </View>
                ) : null}
              </View>
            </ImageBackground>
          </Pressable>
        )}
      />
      {banners.length > 1 && (
        <View style={styles.pagination}>
          {banners.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                currentIndex === i ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      )}

      {/* Superimposed Quick Category Buttons */}
      <View style={styles.quickCategoryRow}>
        <Pressable
          style={styles.quickCategoryBtn}
          onPress={() => onPress && onPress('women', 'Women')}
        >
          <Text style={styles.quickCategoryBtnText}>WOMEN</Text>
        </Pressable>
        <Pressable
          style={styles.quickCategoryBtn}
          onPress={() => onPress && onPress('men', 'Men')}
        >
          <Text style={styles.quickCategoryBtnText}>MEN</Text>
        </Pressable>
        <Pressable
          style={styles.quickCategoryBtn}
          onPress={() => onPress && onPress('kids', 'Kids')}
        >
          <Text style={styles.quickCategoryBtnText}>KIDS</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width,
    height: 520, // Premium luxury proportion matching live ZARR
    backgroundColor: colors.surface,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width,
    height: '100%',
  },
  bgImageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bgImage: {
    resizeMode: 'cover',
  },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    width: '88%',
  },
  eyebrow: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 2.5,
    marginBottom: spacing.xs,
    fontFamily: 'Inter_700Bold',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    color: colors.white,
    marginBottom: spacing.xs,
    lineHeight: 40,
    textTransform: 'uppercase',
  },
  subtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  ctaText: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  pagination: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotActive: {
    backgroundColor: colors.white,
    width: 22, // Elongated active dot
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  quickCategoryRow: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    zIndex: 20,
  },
  quickCategoryBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  quickCategoryBtnText: {
    color: '#000000',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 1,
  },
});
