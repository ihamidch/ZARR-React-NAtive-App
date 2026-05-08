import type {
  Brand,
  CategoryCard,
  Collection,
  OfferBanner,
  Product,
} from '../types';

export const categories: CategoryCard[] = [
  {
    id: 'women',
    title: 'Women',
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'men',
    title: 'Men',
    image:
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'kids',
    title: 'Kids',
    image:
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=900&q=80',
  },
];

export const featuredCollections: Collection[] = [
  {
    id: 'la-toscana',
    title: "La Toscana",
    image:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'mahay-spring',
    title: "Mahay Spring '26",
    image:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'luxury-lawn',
    title: "Luxury Lawn '26",
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'muzlin',
    title: "Muzlin '26",
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  },
];

export const popularWomen: Product[] = [
  {
    id: 'p-w-1',
    title: 'Solare',
    price: 19990,
    image:
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 'p-w-2',
    title: 'Citrus Bloom',
    price: 6990,
    image:
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 'p-w-3',
    title: 'Cirel Set',
    price: 9399,
    image:
      'https://images.unsplash.com/photo-1542295669297-4d352b042bca?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 'p-w-4',
    title: 'ZAIB',
    price: 14950,
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 'p-w-5',
    title: 'Unstitched 3 Piece Lawn Suit',
    price: 4499,
    image:
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 'p-w-6',
    title: 'Unstitched Luxury Lawn Suit',
    price: 17699,
    image:
      'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 'p-w-7',
    title: 'EMBROIDERED BOAT NECK SHIRT',
    price: 9950,
    image:
      'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 'p-w-8',
    title: 'Magenta Raya Set',
    price: 9800,
    image:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
];

export const popularMen: Product[] = [
  {
    id: 'p-m-1',
    title: 'Lok Virsa - Summer Wash & Wear',
    price: 6490,
    image:
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 'p-m-2',
    title: 'Egyptian Delight Plain',
    price: 8500,
    image:
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 'p-m-3',
    title: 'Mashriq Stole',
    price: 3600,
    image:
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 'p-m-4',
    title: 'Prestige',
    price: 14000,
    image:
      'https://images.unsplash.com/photo-1542219550-37153d387c27?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 'p-m-5',
    title: 'Shiffli Kurta Trouser',
    price: 12500,
    image:
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 'p-m-6',
    title: 'Regalia 100 ML',
    price: 6500,
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 'p-m-7',
    title: 'Aura',
    price: 7400,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 'p-m-8',
    title: 'JAMES - GRY',
    price: 11500,
    image:
      'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
];

export const saleWomen: Product[] = [
  {
    id: 's-w-1',
    title: 'TROPeA - 2 Piece Set',
    price: 8650,
    originalPrice: 10650,
    discountPercent: 18,
    image:
      'https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 's-w-2',
    title: 'TEXTURED WIDE LEG TROUSER',
    price: 2975,
    originalPrice: 5950,
    discountPercent: 50,
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 's-w-3',
    title: 'Women Hand Bag - 14789B',
    price: 10170,
    originalPrice: 11300,
    discountPercent: 10,
    image:
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 's-w-4',
    title: 'Women Teal Casual Coat',
    price: 10999,
    originalPrice: 21999,
    discountPercent: 50,
    image:
      'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 's-w-5',
    title: 'Stitched Basic Printed Shirt',
    price: 2400,
    originalPrice: 5999,
    discountPercent: 59,
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 's-w-6',
    title: 'STRIPED BUTTON DOWN DRESS',
    price: 2685,
    originalPrice: 8950,
    discountPercent: 70,
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 's-w-7',
    title: 'TEXTURED KNIT CROPPED TOP',
    price: 1725,
    originalPrice: 3450,
    discountPercent: 50,
    image:
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
  {
    id: 's-w-8',
    title: 'DESERT SAGE-2PC (SHIRT & TROUSER)',
    price: 4770,
    originalPrice: 7950,
    discountPercent: 40,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    category: 'women',
  },
];

export const saleMen: Product[] = [
  {
    id: 's-m-1',
    title: 'LINEN FLAP POCKET BLAZER',
    price: 13996,
    originalPrice: 19995,
    discountPercent: 30,
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 's-m-2',
    title: 'CONTAG - BLK',
    price: 5250,
    originalPrice: 10500,
    discountPercent: 50,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 's-m-3',
    title: 'LINEN TAILORED PANTS',
    price: 5565,
    originalPrice: 7950,
    discountPercent: 30,
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 's-m-4',
    title: 'Zipper Textured Polo',
    price: 2500,
    originalPrice: 4999,
    discountPercent: 49,
    image:
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 's-m-5',
    title: 'JACQUARD PANELLED POCKET SHORTS',
    price: 2225,
    originalPrice: 4450,
    discountPercent: 50,
    image:
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 's-m-6',
    title: 'MEN JEANS',
    price: 3749,
    originalPrice: 4999,
    discountPercent: 25,
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 's-m-7',
    title: 'MEN SWEATER',
    price: 2589,
    originalPrice: 8499,
    discountPercent: 69,
    image:
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
  {
    id: 's-m-8',
    title: 'TEXTURED SHIRT WITH POCKET',
    price: 2975,
    originalPrice: 5950,
    discountPercent: 50,
    image:
      'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=800&q=80',
    category: 'men',
  },
];

export const featuredBrands: Brand[] = [
  { id: 'b-1', name: 'HUSSAIN REHAR', image: '' },
  { id: 'b-2', name: 'Mushq', image: '' },
  { id: 'b-3', name: 'Sana Safinaz', image: '' },
  { id: 'b-4', name: 'J.', image: '' },
  { id: 'b-5', name: 'Junaid Jamshed', image: '' },
  { id: 'b-6', name: 'Manto', image: '' },
  { id: 'b-7', name: 'Ego', image: '' },
  { id: 'b-8', name: 'Naya Dour', image: '' },
  { id: 'b-9', name: 'KOEL', image: '' },
  { id: 'b-10', name: 'TAANA BAANA', image: '' },
];

export const offers: OfferBanner[] = [
  {
    id: 'o-1',
    title: 'Premium styles at',
    highlight: '40% off',
    subtitle: 'Exclusively on ZARR',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'o-2',
    title: 'Hassle-free returns',
    highlight: 'Worry-free',
    subtitle: 'shopping made simple',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'o-3',
    title: 'Premium Fashion',
    highlight: 'Free Shipping',
    subtitle: 'on every order',
    image:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'o-4',
    title: 'ZARR exclusive drops',
    highlight: 'Only here',
    subtitle: 'where exclusivity lives',
    image:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80',
  },
];

export const trendingSearches = [
  'Lawn',
  'Unstitched',
  'Ready to Wear',
  'Men Stitched',
  'Men Unstitched',
  'Sale',
  'Abaya',
];

export const formatPrice = (value: number) =>
  `Rs.${value.toLocaleString('en-PK')}`;
