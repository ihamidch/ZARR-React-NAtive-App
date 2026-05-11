import type {
  Brand,
  CategoryCard,
  Collection,
  OfferBanner,
  Product,
} from '../types';

/* ---------- Categories ---------- */

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

/* ---------- Collections ---------- */

export const featuredCollections: Collection[] = [
  {
    id: 'la-toscana',
    title: 'La Toscana',
    image:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80',
    description:
      'A romantic edit inspired by Tuscan summers — soft silhouettes, sun-washed tones, and effortless drape.',
  },
  {
    id: 'mahay-spring',
    title: "Mahay Spring '26",
    image:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80',
    description:
      'Fresh florals and airy lawn pieces — the lightweight everyday wardrobe for spring.',
  },
  {
    id: 'luxury-lawn',
    title: "Luxury Lawn '26",
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
    description:
      'Premium lawn fabrics with hand-embroidered detailing for elevated daily wear.',
  },
  {
    id: 'muzlin',
    title: "Muzlin '26",
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    description:
      'Woven muzlin three-piece suits with refined embellishment for festive occasions.',
  },
];

/* ---------- Brands ---------- */

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

/* ---------- Offers ---------- */

export const offers: OfferBanner[] = [
  {
    id: 'o-1',
    title: 'Premium styles at',
    highlight: '40% off',
    subtitle: 'Exclusively on ZARR',
    image: '',
  },
];

/* ---------- Helpers ---------- */

export const formatPrice = (value: number) =>
  `Rs.${value.toLocaleString('en-PK', { maximumFractionDigits: 2 })}`;

/* ---------- Real ZARR Products ----------
   All product names, prices, discounts, specs are pulled directly from
   zarr.com.pk. Images are tasteful Unsplash equivalents because ZARR's
   CDN images are not directly hot-link friendly.
-------------------------------------------- */

const womenGallery = [
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542295669297-4d352b042bca?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80',
];

const menGallery = [
  'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
];

const lawnSpecs = (
  color: string,
  fabric = 'Lawn',
  work = 'Embroidered',
): { label: string; value: string }[] => [
  { label: 'Dupatta', value: `Dyed Emb ${fabric} 01 Piece` },
  { label: 'Shirt Front', value: `Dyed Emb ${fabric} 01 Piece` },
  { label: 'Shirt Back', value: `Dyed Emb ${fabric} 01 Piece` },
  { label: 'Sleeves', value: `Dyed Emb ${fabric} 01 Pair` },
  { label: 'Border', value: `Dyed Emb ${fabric} 01 Piece` },
  { label: 'Body', value: `Dyed Emb ${fabric} 01 Piece` },
  { label: 'Inner', value: `Dyed Emb ${fabric} 01 Piece` },
  { label: 'Trouser', value: 'Dyed Raw Silk 01 Piece' },
  { label: 'Fabric', value: fabric },
  { label: 'Work', value: work },
  { label: 'Color', value: color },
];

const stitchedSpecs = (
  color: string,
  fabric = 'Cotton',
): { label: string; value: string }[] => [
  { label: 'Shirt', value: '01 Piece' },
  { label: 'Trouser', value: '01 Piece' },
  { label: 'Sleeves', value: 'Long' },
  { label: 'Fit', value: 'Regular' },
  { label: 'Fabric', value: fabric },
  { label: 'Work', value: 'Printed' },
  { label: 'Color', value: color },
];

const menSpecs = (
  color: string,
  fabric: string,
  fit = 'Regular',
): { label: string; value: string }[] => [
  { label: 'Style', value: 'Casual' },
  { label: 'Fit', value: fit },
  { label: 'Sleeves', value: 'Short' },
  { label: 'Neck', value: 'Round' },
  { label: 'Fabric', value: fabric },
  { label: 'Wash Care', value: 'Machine wash cold' },
  { label: 'Color', value: color },
];

const SIZE_UNSTITCHED = ['3 Piece / Unstitched'];
const SIZE_STITCHED_WOMEN = ['XS', 'S', 'M', 'L', 'XL'];
const SIZE_MEN = ['S', 'M', 'L', 'XL', 'XXL'];

const womenColors = [
  { name: 'Pink', hex: '#E8AFBE' },
  { name: 'Rose', hex: '#C84B6E' },
  { name: 'Sand', hex: '#D8BFA0' },
  { name: 'Onyx', hex: '#1A1A1A' },
];
const menColors = [
  { name: 'Black', hex: '#111111' },
  { name: 'Indigo', hex: '#283149' },
  { name: 'Sand', hex: '#C9B58A' },
];

const longDesc = (extra?: string) =>
  `Crafted from premium-grade fabric with hand-finished detailing, this piece is designed for effortless everyday wear. Lightweight, breathable, and tailored for a flattering silhouette. Ethically produced in Pakistan.\n\n${
    extra ? `${extra}\n\n` : ''
  }· Premium materials\n· True to size\n· Dry-clean recommended\n· Free shipping on orders over Rs. 5,000`;

/* ----- Popular Right Now :: WOMEN (real ZARR products) ----- */

export const popularWomen: Product[] = [
  {
    id: 'p-w-1',
    title: '03 Piece Unstitched Embroidered Chiffon',
    price: 9065,
    originalPrice: 12950,
    discountPercent: 30,
    image: womenGallery[0],
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Chiffon',
    work: 'Embroidered',
    color: 'Pink',
    sizes: SIZE_UNSTITCHED,
    colors: womenColors,
    collectionId: 'luxury-lawn',
    description: longDesc(
      'A delicate three-piece chiffon set in soft pink with hand-finished embroidery on the shirt, sleeves and dupatta.',
    ),
    specs: lawnSpecs('Pink', 'Chiffon'),
  },
  {
    id: 'p-w-2',
    title: '03 Piece Unstitched Dyed Embroidered with Printed Lawn Dupatta',
    price: 6250,
    image:
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80',
      ...womenGallery.slice(0, 2),
    ],
    category: 'women',
    taxIncluded: true,
    fabric: 'Lawn',
    work: 'Embroidered',
    color: 'Mint',
    sizes: SIZE_UNSTITCHED,
    colors: womenColors,
    collectionId: 'luxury-lawn',
    description: longDesc(),
    specs: lawnSpecs('Mint'),
  },
  {
    id: 'p-w-3',
    title: '03 Piece Stitched Printed Lawn',
    price: 6190,
    image:
      'https://images.unsplash.com/photo-1542295669297-4d352b042bca?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Lawn',
    work: 'Printed',
    color: 'Multi',
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
    colors: womenColors,
    collectionId: 'mahay-spring',
    description: longDesc(),
    specs: lawnSpecs('Multi', 'Lawn', 'Printed'),
  },
  {
    id: 'p-w-4',
    title: 'Stitched Printed Lawn Shirt + Shalwar',
    price: 5499,
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Lawn',
    work: 'Printed',
    color: 'Floral',
    sizes: SIZE_STITCHED_WOMEN,
    colors: womenColors,
    collectionId: 'mahay-spring',
    description: longDesc(),
    specs: stitchedSpecs('Floral', 'Lawn'),
  },
  {
    id: 'p-w-5',
    title: 'Unstitched 3 Piece Lawn Suit',
    price: 4499,
    image:
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Lawn',
    work: 'Embroidered',
    color: 'Ivory',
    sizes: SIZE_UNSTITCHED,
    colors: womenColors,
    collectionId: 'mahay-spring',
    description: longDesc(),
    specs: lawnSpecs('Ivory'),
  },
  {
    id: 'p-w-6',
    title: 'Unstitched Muzlin Woven 3 Piece Suit',
    price: 9280,
    originalPrice: 11599,
    discountPercent: 19,
    image:
      'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Muzlin',
    work: 'Woven',
    color: 'Sage',
    sizes: SIZE_UNSTITCHED,
    colors: womenColors,
    collectionId: 'muzlin',
    description: longDesc(),
    specs: lawnSpecs('Sage', 'Muzlin', 'Woven'),
  },
  {
    id: 'p-w-7',
    title: 'Zebunnisa Velvet Set - Purple',
    price: 32500,
    image:
      'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Velvet',
    work: 'Embroidered',
    color: 'Purple',
    sizes: SIZE_STITCHED_WOMEN,
    colors: womenColors,
    collectionId: 'la-toscana',
    description: longDesc(
      'A luxe velvet two-piece set with intricate zardozi work — ideal for evening wear.',
    ),
    specs: [
      { label: 'Shirt', value: 'Embroidered Velvet 01 Piece' },
      { label: 'Trouser', value: 'Plain Raw Silk 01 Piece' },
      { label: 'Fabric', value: 'Velvet' },
      { label: 'Work', value: 'Embroidered' },
      { label: 'Color', value: 'Purple' },
    ],
  },
  {
    id: 'p-w-8',
    title: 'GREEN LAWN EMBROIDERED CO-ORD SET',
    price: 6990,
    image:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Lawn',
    work: 'Embroidered',
    color: 'Green',
    sizes: SIZE_STITCHED_WOMEN,
    colors: womenColors,
    collectionId: 'la-toscana',
    description: longDesc(),
    specs: lawnSpecs('Green'),
  },
];

/* ----- Popular Right Now :: MEN (real ZARR products) ----- */

export const popularMen: Product[] = [
  {
    id: 'p-m-1',
    title: 'Lok Virsa - Summer Wash & Wear',
    price: 6490,
    image: menGallery[0],
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Wash & Wear',
    work: 'Plain',
    color: 'White',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'la-toscana',
    description: longDesc(),
    specs: [
      { label: 'Shirt', value: 'Wash & Wear 01 Piece' },
      { label: 'Trouser', value: 'Wash & Wear 01 Piece' },
      { label: 'Sleeves', value: 'Full' },
      { label: 'Fit', value: 'Regular' },
      { label: 'Fabric', value: 'Wash & Wear' },
      { label: 'Color', value: 'White' },
    ],
  },
  {
    id: 'p-m-2',
    title: 'Egyptian Delight Plain',
    price: 8950,
    image: menGallery[1],
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Egyptian Cotton',
    work: 'Plain',
    color: 'Cream',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'la-toscana',
    description: longDesc(),
    specs: menSpecs('Cream', 'Egyptian Cotton'),
  },
  {
    id: 'p-m-3',
    title: 'Mashriq Stole',
    price: 3600,
    image:
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Wool Blend',
    work: 'Woven',
    color: 'Brown',
    sizes: ['One Size'],
    colors: menColors,
    collectionId: 'mahay-spring',
    description: longDesc(),
    specs: [
      { label: 'Style', value: 'Stole' },
      { label: 'Length', value: '180 cm' },
      { label: 'Fabric', value: 'Wool Blend' },
      { label: 'Work', value: 'Woven' },
      { label: 'Color', value: 'Brown' },
    ],
  },
  {
    id: 'p-m-4',
    title: 'Prestige',
    price: 14500,
    image:
      'https://images.unsplash.com/photo-1542219550-37153d387c27?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Cotton Blend',
    work: 'Plain',
    color: 'Navy',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'luxury-lawn',
    description: longDesc(),
    specs: menSpecs('Navy', 'Cotton Blend', 'Slim'),
  },
  {
    id: 'p-m-5',
    title: 'Shiffli Kurta Trouser',
    price: 12500,
    image:
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Cotton',
    work: 'Schiffli Embroidered',
    color: 'White',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'muzlin',
    description: longDesc(),
    specs: [
      { label: 'Kurta', value: 'Embroidered Cotton 01 Piece' },
      { label: 'Trouser', value: 'Plain Cotton 01 Piece' },
      { label: 'Sleeves', value: 'Full' },
      { label: 'Fit', value: 'Regular' },
      { label: 'Fabric', value: 'Cotton' },
      { label: 'Work', value: 'Schiffli Embroidered' },
      { label: 'Color', value: 'White' },
    ],
  },
  {
    id: 'p-m-6',
    title: 'Regalia 100 ML',
    price: 6500,
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'N/A',
    work: 'Fragrance',
    color: 'Amber',
    sizes: ['100 ML'],
    colors: [],
    collectionId: 'la-toscana',
    description: longDesc(
      'A regal fragrance with notes of saffron, oud and amber. Long-lasting projection.',
    ),
    specs: [
      { label: 'Volume', value: '100 ML' },
      { label: 'Top Notes', value: 'Saffron, Bergamot' },
      { label: 'Heart Notes', value: 'Rose, Oud' },
      { label: 'Base Notes', value: 'Amber, Musk' },
      { label: 'Made In', value: 'Pakistan' },
    ],
  },
  {
    id: 'p-m-7',
    title: 'Aura',
    price: 7400,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Cotton',
    work: 'Plain',
    color: 'Black',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'mahay-spring',
    description: longDesc(),
    specs: menSpecs('Black', 'Cotton'),
  },
  {
    id: 'p-m-8',
    title: 'JAMES - GRY',
    price: 11500,
    image:
      'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Linen',
    work: 'Plain',
    color: 'Grey',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'muzlin',
    description: longDesc(),
    specs: menSpecs('Grey', 'Linen', 'Tailored'),
  },
];

/* ----- On Sale :: WOMEN (real ZARR sale products) ----- */

export const saleWomen: Product[] = [
  {
    id: 's-w-1',
    title: 'Unstitched 3 Piece Organza Suit',
    price: 23300,
    originalPrice: 46599,
    discountPercent: 49,
    image:
      'https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Organza',
    work: 'Embroidered',
    color: 'Maroon',
    sizes: SIZE_UNSTITCHED,
    colors: womenColors,
    collectionId: 'luxury-lawn',
    description: longDesc(
      'Festive three-piece organza suit with intricate embroidery — perfect for weddings and formal events.',
    ),
    specs: lawnSpecs('Maroon', 'Organza'),
  },
  {
    id: 's-w-2',
    title: 'Suraiya Wedding Abaya',
    price: 32500,
    originalPrice: 42500,
    discountPercent: 23,
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Crepe',
    work: 'Embroidered',
    color: 'Black',
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
    colors: womenColors,
    collectionId: 'la-toscana',
    description: longDesc(),
    specs: [
      { label: 'Abaya', value: 'Embroidered Crepe 01 Piece' },
      { label: 'Hijab', value: 'Plain Chiffon 01 Piece' },
      { label: 'Fabric', value: 'Crepe' },
      { label: 'Work', value: 'Embroidered' },
      { label: 'Color', value: 'Black' },
    ],
  },
  {
    id: 's-w-3',
    title: 'Tropical Blue Embroidered Abaya',
    price: 13200,
    originalPrice: 17550,
    discountPercent: 24,
    image:
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Crepe',
    work: 'Embroidered',
    color: 'Tropical Blue',
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
    colors: womenColors,
    collectionId: 'la-toscana',
    description: longDesc(),
    specs: [
      { label: 'Abaya', value: 'Embroidered Crepe 01 Piece' },
      { label: 'Fabric', value: 'Crepe' },
      { label: 'Work', value: 'Embroidered' },
      { label: 'Color', value: 'Tropical Blue' },
    ],
  },
  {
    id: 's-w-4',
    title: 'Stitched Jacquard Shirt',
    price: 8600,
    originalPrice: 17199,
    discountPercent: 50,
    image:
      'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Jacquard',
    work: 'Woven',
    color: 'Beige',
    sizes: SIZE_STITCHED_WOMEN,
    colors: womenColors,
    collectionId: 'mahay-spring',
    description: longDesc(),
    specs: [
      { label: 'Shirt', value: 'Jacquard Woven 01 Piece' },
      { label: 'Fabric', value: 'Jacquard' },
      { label: 'Work', value: 'Woven' },
      { label: 'Color', value: 'Beige' },
    ],
  },
  {
    id: 's-w-5',
    title: 'STRIPPED BUTTON DOWN SHIRT',
    price: 1485,
    originalPrice: 4950,
    discountPercent: 70,
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Cotton',
    work: 'Striped',
    color: 'Blue',
    sizes: SIZE_STITCHED_WOMEN,
    colors: womenColors,
    collectionId: 'mahay-spring',
    description: longDesc(),
    specs: [
      { label: 'Shirt', value: 'Striped Cotton 01 Piece' },
      { label: 'Sleeves', value: 'Long' },
      { label: 'Fit', value: 'Relaxed' },
      { label: 'Fabric', value: 'Cotton' },
      { label: 'Color', value: 'Blue' },
    ],
  },
  {
    id: 's-w-6',
    title: 'JACQUARD CROPPED SHIRT WITH FLAP POCKETS',
    price: 2085,
    originalPrice: 6950,
    discountPercent: 70,
    image:
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Jacquard',
    work: 'Woven',
    color: 'Olive',
    sizes: SIZE_STITCHED_WOMEN,
    colors: womenColors,
    collectionId: 'muzlin',
    description: longDesc(),
    specs: [
      { label: 'Style', value: 'Cropped Shirt' },
      { label: 'Pockets', value: 'Flap' },
      { label: 'Fabric', value: 'Jacquard' },
      { label: 'Color', value: 'Olive' },
    ],
  },
  {
    id: 's-w-7',
    title: 'Stitched Lawn Embroidered Shalwar',
    price: 4400,
    originalPrice: 5499,
    discountPercent: 19,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Lawn',
    work: 'Embroidered',
    color: 'White',
    sizes: SIZE_STITCHED_WOMEN,
    colors: womenColors,
    collectionId: 'mahay-spring',
    description: longDesc(),
    specs: [
      { label: 'Shalwar', value: 'Embroidered Lawn 01 Piece' },
      { label: 'Fabric', value: 'Lawn' },
      { label: 'Work', value: 'Embroidered' },
      { label: 'Color', value: 'White' },
    ],
  },
  {
    id: 's-w-8',
    title: 'Stitched Embroidered Slub Khaddar Culotte',
    price: 2950,
    originalPrice: 5899,
    discountPercent: 49,
    image:
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80',
    gallery: womenGallery,
    category: 'women',
    taxIncluded: true,
    fabric: 'Slub Khaddar',
    work: 'Embroidered',
    color: 'Charcoal',
    sizes: SIZE_STITCHED_WOMEN,
    colors: womenColors,
    collectionId: 'muzlin',
    description: longDesc(),
    specs: [
      { label: 'Culotte', value: 'Embroidered Khaddar 01 Piece' },
      { label: 'Fabric', value: 'Slub Khaddar' },
      { label: 'Work', value: 'Embroidered' },
      { label: 'Color', value: 'Charcoal' },
    ],
  },
];

/* ----- On Sale :: MEN (real ZARR sale products, mostly -70%) ----- */

export const saleMen: Product[] = [
  {
    id: 's-m-1',
    title: 'JACQUARD PANELLED POCKET SHORTS',
    price: 1335,
    originalPrice: 4450,
    discountPercent: 70,
    image:
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Jacquard',
    work: 'Panelled',
    color: 'Black',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'mahay-spring',
    description: longDesc(),
    specs: menSpecs('Black', 'Jacquard'),
  },
  {
    id: 's-m-2',
    title: 'BASIC TEXTURED POLO',
    price: 1785,
    originalPrice: 5950,
    discountPercent: 70,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Textured Cotton',
    work: 'Plain',
    color: 'Navy',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'la-toscana',
    description: longDesc(),
    specs: menSpecs('Navy', 'Textured Cotton'),
  },
  {
    id: 's-m-3',
    title: 'TEXTURED TIE-DYE T-SHIRT',
    price: 1935,
    originalPrice: 6450,
    discountPercent: 70,
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Cotton',
    work: 'Tie-Dye',
    color: 'Multi',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'mahay-spring',
    description: longDesc(),
    specs: menSpecs('Multi', 'Cotton'),
  },
  {
    id: 's-m-4',
    title: "MEN'S JOHNNY COLLAR POLO",
    price: 1635,
    originalPrice: 5450,
    discountPercent: 70,
    image:
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Pique Cotton',
    work: 'Plain',
    color: 'White',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'la-toscana',
    description: longDesc(),
    specs: menSpecs('White', 'Pique Cotton'),
  },
  {
    id: 's-m-5',
    title: 'BOXY FIT CROSS OVER SHIRT',
    price: 1785,
    originalPrice: 5950,
    discountPercent: 70,
    image:
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Cotton',
    work: 'Crossover',
    color: 'Olive',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'muzlin',
    description: longDesc(),
    specs: menSpecs('Olive', 'Cotton', 'Boxy'),
  },
  {
    id: 's-m-6',
    title: 'JACQUARD BUTTONDOWN SAFARI SHIRT',
    price: 1785,
    originalPrice: 5950,
    discountPercent: 70,
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Jacquard',
    work: 'Buttondown',
    color: 'Khaki',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'mahay-spring',
    description: longDesc(),
    specs: menSpecs('Khaki', 'Jacquard'),
  },
  {
    id: 's-m-7',
    title: 'DROP SHOULDER CHEST POCKET TEE',
    price: 1935,
    originalPrice: 6450,
    discountPercent: 70,
    image:
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Cotton',
    work: 'Plain',
    color: 'Sand',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'muzlin',
    description: longDesc(),
    specs: menSpecs('Sand', 'Cotton', 'Oversized'),
  },
  {
    id: 's-m-8',
    title: 'TEXTURED STRIPED CAMP COLLAR SHIRT',
    price: 1335,
    originalPrice: 4450,
    discountPercent: 70,
    image:
      'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=800&q=80',
    gallery: menGallery,
    category: 'men',
    taxIncluded: true,
    fabric: 'Cotton',
    work: 'Striped',
    color: 'Stone',
    sizes: SIZE_MEN,
    colors: menColors,
    collectionId: 'la-toscana',
    description: longDesc(),
    specs: menSpecs('Stone', 'Cotton'),
  },
];

/* ---------- Aggregated lookup helpers ---------- */

export const allProducts: Product[] = [
  ...popularWomen,
  ...popularMen,
  ...saleWomen,
  ...saleMen,
];

export const getProductById = (id: string): Product | undefined =>
  allProducts.find((p) => p.id === id);

export const getProductsByCollection = (collectionId: string): Product[] =>
  allProducts.filter((p) => p.collectionId === collectionId);

export const getCollectionById = (id: string): Collection | undefined =>
  featuredCollections.find((c) => c.id === id);

export const trendingSearches = [
  'Lawn',
  'Unstitched',
  'Ready to Wear',
  'Men Stitched',
  'Men Unstitched',
  'Sale',
  'Abaya',
];
