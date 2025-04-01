// src/constants/typography.ts
import { TextStyle, Platform } from 'react-native';
import { COLORS } from './colors';

const sansSerifFont = Platform.select({ ios: 'System', android: 'sans-serif' });
const monospaceFont = Platform.select({ ios: 'Menlo', android: 'monospace' });

// Define the styles first
export const TYPOGRAPHY = {
    displayLarge: { fontSize: 34, fontWeight: '300', fontFamily: sansSerifFont, color: COLORS.textPrimary },
    title1: { fontSize: 28, fontWeight: 'bold', fontFamily: sansSerifFont, color: COLORS.textPrimary },
    title2: { fontSize: 22, fontWeight: 'bold', fontFamily: sansSerifFont, color: COLORS.textPrimary },
    title3: { fontSize: 20, fontWeight: '600', fontFamily: sansSerifFont, color: COLORS.textPrimary },
    title3Uppercase: { fontSize: 14, fontWeight: '600', fontFamily: sansSerifFont, color: COLORS.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase' },
    headline: { fontSize: 17, fontWeight: '600', fontFamily: sansSerifFont, color: COLORS.textPrimary },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 22, fontFamily: sansSerifFont, color: COLORS.textPrimary },
    bodyBold: { fontSize: 16, fontWeight: '600', lineHeight: 22, fontFamily: sansSerifFont, color: COLORS.textPrimary },
    callout: { fontSize: 16, fontWeight: '400', fontFamily: sansSerifFont, color: COLORS.textPrimary },
    subhead: { fontSize: 15, fontWeight: '400', fontFamily: sansSerifFont, color: COLORS.textSecondary },
    footnote: { fontSize: 13, fontWeight: '400', fontFamily: sansSerifFont, color: COLORS.textSecondary },
    caption1: { fontSize: 12, fontWeight: '400', fontFamily: sansSerifFont, color: COLORS.textSecondary },
    caption2: { fontSize: 11, fontWeight: '400', fontFamily: sansSerifFont, color: COLORS.textSecondary },
    monoBody: { fontFamily: monospaceFont, fontSize: 16, fontWeight: '500', color: COLORS.textPrimary },
    monoFootnote: { fontFamily: monospaceFont, fontSize: 13, color: COLORS.textSecondary },
    buttonPrimary: { fontFamily: sansSerifFont, fontSize: 17, fontWeight: '600' }, // Color handled in Button
    buttonSecondary: { fontFamily: sansSerifFont, fontSize: 17, fontWeight: '400' }, // Color handled in Button
    buttonDestructive: { fontFamily: sansSerifFont, fontSize: 17, fontWeight: '400' }, // Color handled in Button
} as const; // Use 'as const' for stricter typing if preferred

// Define the type based on the keys of the TYPOGRAPHY object
export type TextVariant = keyof typeof TYPOGRAPHY;

// You can also export the TextStyle type if needed elsewhere
export type TypographyStyle = TextStyle;
