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
