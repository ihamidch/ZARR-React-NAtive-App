export type Product = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image: string;
  category: 'women' | 'men';
};

export type Collection = {
  id: string;
  title: string;
  image: string;
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
