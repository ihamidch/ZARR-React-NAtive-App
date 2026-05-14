import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, typography, fonts } from '../theme';
import { formatPrice } from '../data';
import { CartScreenProps } from '../types/navigation';

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartScreenProps['navigation']>();
  const { cart, removeFromCart, updateQuantity, totalAmount, itemCount } = useCart();

  const onCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add some items to your cart before checking out.');
      return;
    }
    Alert.alert('Coming Soon', 'Checkout functionality will be available in the next update!');
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Shopping Bag</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={80} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <Text style={styles.emptySubtitle}>
            Looks like you haven't added anything to your bag yet.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Home')}
            style={styles.continueButton}
          >
            <Text style={styles.continueButtonText}>CONTINUE SHOPPING</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Shopping Bag ({itemCount})</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {cart.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Pressable onPress={() => removeFromCart(item.id)}>
                  <Ionicons name="close" size={20} color={colors.textMuted} />
                </Pressable>
              </View>
              
              <Text style={styles.itemVariant}>
                {item.color}{item.size ? ` · Size: ${item.size}` : ''}
              </Text>
              
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                <View style={styles.quantityContainer}>
                  <Pressable
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    style={styles.qtyButton}
                  >
                    <Ionicons name="remove" size={16} color={colors.text} />
                  </Pressable>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <Pressable
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    style={styles.qtyButton}
                  >
                    <Ionicons name="add" size={16} color={colors.text} />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(totalAmount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>Calculated at checkout</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
          </View>
          <Text style={styles.taxNote}>Inclusive of all taxes</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={onCheckout} style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>PROCEED TO CHECKOUT</Text>
        </Pressable>
      </View>
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
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.text,
    textTransform: 'uppercase',
  },
  scrollContent: {
    padding: spacing.m,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    // Add subtle shadow for premium feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  itemImage: {
    width: 100,
    height: 130,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.m,
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  itemVariant: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  itemPrice: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.text,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  qtyButton: {
    padding: 6,
  },
  qtyText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
    paddingHorizontal: 8,
  },
  summaryContainer: {
    marginTop: spacing.lg,
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.m,
    textTransform: 'uppercase',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  summaryValue: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.text,
  },
  totalValue: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.text,
  },
  taxNote: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  footer: {
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  checkoutButton: {
    backgroundColor: colors.text,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.background,
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  continueButton: {
    borderWidth: 1,
    borderColor: colors.text,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
  },
  continueButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.text,
    letterSpacing: 1,
  },
});
