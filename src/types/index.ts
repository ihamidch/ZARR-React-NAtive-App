export type Product = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image: string;
  gallery?: string[];
  category: 'women' | 'men';
  description?: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  collectionId?: string;
  inStock?: boolean;
  taxIncluded?: boolean;
  fabric?: string;
  work?: string;
  color?: string;
  specs?: { label: string; value: string }[];
  brand?: string;
};

export type Collection = {
  id: string;
  title: string;
  image: string;
  description?: string;
  brand?: string;
  bannerImage?: string;
};

export type Brand = {
  id: string;
  name: string;
  image: string;
};

export type CategoryCard = {
  id: string;
  title: string;
  image: string;
};

export type OfferBanner = {
  id: string;
  title: string;
  highlight: string;
  subtitle?: string;
  image: string;
};
