# ZARR — React Native Home Page Clone

A frontend-only React Native (Expo + TypeScript) clone of the [zarr.com.pk](https://zarr.com.pk/) home page.

## What's inside

The home screen is composed of these sections (matching the live site):

1. **Header** — hamburger menu, ZARR logo, wishlist / account / cart icons, search bar and `WOMEN / MEN / KIDS` tabs.
2. **Shop By Category** — three full-width image cards (Women / Men / Kids).
3. **Featured Collections** — horizontal scroll of collection cards (La Toscana, Mahay Spring '26, Luxury Lawn '26, Muzlin '26).
4. **Popular Right Now** — Women / Men tabs with hero card + horizontal product list.
5. **On Sale Right Now** — Women / Men tabs with discount-percentage badges on each product.
6. **Featured Brands** — grid of brand tiles.
7. **Offers Just For You** — promotional banners (40% off, Free shipping, Returns, Exclusive drops).
8. **Footer** — newsletter sign-up, Help & Information, About ZARR, Follow Us, copyright.

## Project structure

```
ZarrApp/
├── App.tsx
├── index.ts
└── src/
    ├── components/
    │   ├── CategoryGrid.tsx
    │   ├── FeaturedBrands.tsx
    │   ├── FeaturedCollections.tsx
    │   ├── Footer.tsx
    │   ├── Header.tsx
    │   ├── OffersSection.tsx
    │   ├── ProductCard.tsx
    │   ├── ProductCarousel.tsx
    │   └── SectionHeader.tsx
    ├── data/index.ts          # all product / collection / brand mock data
    ├── screens/HomeScreen.tsx
    ├── theme/index.ts          # colors, spacing, radii, typography
    └── types/index.ts
```

## Run it

```bash
cd ZarrApp
npm install            # already done if you ran setup
npm run android        # open on Android emulator / Expo Go
npm run ios            # open on iOS simulator (macOS only)
npm start              # opens the Expo dev menu — scan QR with Expo Go
```

For web support, also install the optional deps:

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
npm run web
```

## Notes

- This is **frontend only** — there is no API, navigation library, or cart state. Every pressable is a stub.
- Product images are sourced from Unsplash since the real ZARR catalogue images aren't publicly hosted with hot-link friendly URLs. Swap them out in `src/data/index.ts` for real product photos.
- The icons in the header / footer are unicode glyphs to keep the project dependency-free. You can replace them with `@expo/vector-icons` for production.
