import React from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

type OfferTone = 'rose' | 'cream' | 'roseImage' | 'darkImage';

type Offer = {
  id: string;
  tone: OfferTone;
  bigTop?: string;
  bigBottom: string;
  small: string;
  image?: string;
};

const offerCards: Offer[] = [
  {
    id: 'o-1',
    tone: 'rose',
    bigTop: '40%',
    bigBottom: 'OFF',
    small: 'PREMIUM\nSTYLES',
  },
  {
    id: 'o-2',
    tone: 'cream',
    bigBottom: 'FREE\n& EASY',
    small: 'RETURNS',
  },
  {
    id: 'o-3',
    tone: 'roseImage',
    bigBottom: 'FREE\nSHIPPING',
    small: 'ON EVERY ORDER',
    image:
      'https://images.unsplash.com/photo-1542295669297-4d352b042bca?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'o-4',
    tone: 'darkImage',
    bigBottom: 'EXCLUSIVE\nDROPS',
    small: 'ONLY ON ZARR',
    image:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
  },
];

const RoseCard = ({ offer }: { offer: Offer }) => (
  <Pressable style={[styles.card, { backgroundColor: colors.accent }]}>
    <View style={styles.cardInner}>
      <View>
        <Text style={[styles.cardSmall, { color: colors.white, opacity: 0.9 }]}>
          {offer.small}
        </Text>
      </View>
      <View>
        <Text style={[styles.cardMega, { color: colors.white }]}>
          {offer.bigTop}
        </Text>
        <Text style={[styles.cardBig, { color: colors.white }]}>
          {offer.bigBottom}
        </Text>
        <Pressable style={styles.cardCtaRound}>
          <Ionicons name="arrow-forward" size={14} color={colors.accent} />
        </Pressable>
      </View>
    </View>
  </Pressable>
);

const CreamCard = ({ offer }: { offer: Offer }) => (
  <Pressable style={[styles.card, { backgroundColor: colors.surface }]}>
    <View style={styles.cardInner}>
      <View>
        <Text style={[styles.cardSmall, { color: colors.textMuted }]}>
          {offer.small}
        </Text>
      </View>
      <View>
        <Text style={[styles.cardBig, { color: colors.text }]}>
          {offer.bigBottom}
        </Text>
        <Pressable
          style={[styles.cardCtaRound, { backgroundColor: colors.text }]}
        >
          <Ionicons name="arrow-forward" size={14} color={colors.white} />
        </Pressable>
      </View>
    </View>
  </Pressable>
);

const ImageCard = ({
  offer,
  tint,
}: {
  offer: Offer;
  tint: string;
}) => (
  <Pressable style={styles.card}>
    <ImageBackground
      source={{ uri: offer.image }}
      style={styles.cardBg}
      imageStyle={styles.cardBgImage}
    >
      <View style={[styles.cardTint, { backgroundColor: tint }]} />
      <View style={styles.cardInner}>
        <Text style={[styles.cardSmall, { color: colors.white, opacity: 0.9 }]}>
          {offer.small}
        </Text>
        <View>
          <Text style={[styles.cardBig, { color: colors.white }]}>
            {offer.bigBottom}
          </Text>
          <Pressable style={styles.cardCtaRound}>
            <Ionicons name="arrow-forward" size={14} color={colors.text} />
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  </Pressable>
);

export const OffersSection = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <RoseCard offer={offerCards[0]} />
        <CreamCard offer={offerCards[1]} />
      </View>
      <View style={styles.row}>
        <ImageCard offer={offerCards[2]} tint="rgba(200,75,110,0.55)" />
        <ImageCard offer={offerCards[3]} tint="rgba(0,0,0,0.55)" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  cardBg: {
    flex: 1,
  },
  cardBgImage: {
    resizeMode: 'cover',
  },
  cardTint: {
    ...StyleSheet.absoluteFillObject,
  },
  cardInner: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  cardSmall: {
    ...typography.tiny,
    letterSpacing: 2,
    lineHeight: 16,
  },
  cardMega: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 38,
    letterSpacing: 1,
    lineHeight: 42,
  },
  cardBig: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    letterSpacing: 1,
    lineHeight: 26,
    marginTop: 2,
  },
  cardCtaRound: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
});
