import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Collection: {
    collectionId: string;
    title: string;
  };
  ProductDetail: {
    productId: string;
  };
  Login: undefined;
  Register: undefined;
  Account: undefined;
  Cart: undefined;
  Brands: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type CollectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Collection'
>;
export type ProductDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetail'
>;
export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;
export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;
export type AccountScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Account'
>;
export type CartScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Cart'
>;
export type BrandsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Brands'
>;
