import React, { useRef, useState, useEffect } from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { colors, typography, spacing } from '../theme';

const { width } = Dimensions.get('window');

type Banner = {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
};

type Props = {
  banners: Banner[];
};

export const HeroBanner = ({ banners }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.slide}
            imageStyle={styles.bgImage}
          >
            <View style={styles.overlayTop} />
            <View style={styles.overlayBottom} />

            <View style={styles.content}>
              {item.eyebrow ? (
                <View style={styles.eyebrowRow}>
                  <Text style={styles.eyebrow}>{item.eyebrow}</Text>
                </View>
              ) : null}
              <Text style={styles.title}>{item.title}</Text>
              {item.subtitle ? (
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              ) : null}
            </View>
          </ImageBackground>
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width,
    height: 550, // Premium luxury proportion
    backgroundColor: colors.surface,
  },
  slide: {
    width,
    height: '100%',
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
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center', // Center align for luxury feel
  },
  eyebrowRow: {
    marginBottom: spacing.sm,
  },
  eyebrow: {
    ...typography.tiny,
    color: colors.white,
    letterSpacing: 4,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 42,
    color: colors.white,
    marginBottom: spacing.sm,
    textAlign: 'center',
    lineHeight: 48,
    textTransform: 'uppercase',
  },
  subtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
    maxWidth: '90%',
    lineHeight: 22,
  },
  pagination: {
    position: 'absolute',
    bottom: spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: colors.white,
    width: 24, // Elongated active dot
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});
