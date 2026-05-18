import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBrands } from '../hooks/useProducts';
import { colors, radius, shadows, spacing, typography } from '../theme';
import type { BrandsScreenProps } from '../types/navigation';

export const BrandsScreen = ({ navigation }: BrandsScreenProps) => {
  const { data: brands, status } = useBrands();

  const goBrand = (brandName: string) => {
    navigation.navigate('Collection', {
      collectionId: brandName,
      title: brandName,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </Pressable>
        <Text style={styles.headerTitle}>SHOP BY BRAND</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={brands}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.8 },
            ]}
            onPress={() => goBrand(item.title)}
          >
            <Text style={styles.brandName}>{item.title}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          status === 'ready' ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No brands found.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h2,
    letterSpacing: 2,
    fontWeight: '700',
  },
  list: {
    padding: spacing.lg,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brandName: {
    ...typography.bodyBold,
    textAlign: 'center',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  empty: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
