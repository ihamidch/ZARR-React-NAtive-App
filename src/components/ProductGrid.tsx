import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';
import { spacing } from '../theme';

type Props = {
  products: Product[];
  onProductPress?: (productId: string) => void;
};

export const ProductGrid = ({ products, onProductPress }: Props) => {
  return (
    <View style={styles.grid}>
      {products.map((p) => (
        <View key={p.id} style={styles.itemWrapper}>
          <ProductCard
            product={p}
            width={null as any} // let it fill the wrapper
            onPress={() => onProductPress?.(p.id)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  itemWrapper: {
    width: '47.5%', // Slightly less than 50% to account for gap
    marginBottom: spacing.md,
  },
});
