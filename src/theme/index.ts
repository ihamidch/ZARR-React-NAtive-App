export const colors = {
  background: '#FFFFFF',
  surface: '#FAF7F4',
  surfaceAlt: '#F2EEE9',
  text: '#0E0E0E',
  textMuted: '#7A7A7A',
  textInverse: '#FFFFFF',
  border: '#E7E1DA',
  divider: '#D9D2C9',
  brand: '#0E0E0E',
  accent: '#C84B6E',
  accentSoft: '#F4D8DF',
  gold: '#B68A5C',
  sale: '#C0392B',
  black: '#000000',
  white: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.35)',
  overlayDark: 'rgba(0,0,0,0.55)',
  footerBg: '#0B0B0B',
  newsletterBg: '#161616',
  sectionWhite: '#FFFFFF',
  sectionCream: '#F8F4EE',
  sectionBeige: '#F4EDE3',
  sectionRose: '#FBEEF1',
  sectionDark: '#0E0E0E',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 14,
  xl: 22,
  pill: 999,
};

export const fonts = {
  display: 'PlayfairDisplay_700Bold',
  displayItalic: 'PlayfairDisplay_700Bold_Italic',
  serif: 'PlayfairDisplay_400Regular',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
};

export const typography = {
  brand: {
    fontFamily: fonts.display,
    fontSize: 30,
    letterSpacing: 6,
    color: colors.text,
  },
  hero: {
    fontFamily: fonts.display,
    fontSize: 36,
    letterSpacing: 1,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: 0.5,
  },
  h2: {
    fontFamily: fonts.bodySemi,
    fontSize: 18,
    letterSpacing: 0.3,
  },
  h3: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
  },
  bodyMed: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },
  small: {
    fontFamily: fonts.body,
    fontSize: 12,
  },
  smallMed: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
  },
  tiny: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.5,
  },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
};
