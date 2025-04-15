// src/constants/typography.ts
import { TextStyle, Platform } from 'react-native';
import { COLORS } from './colors';

// Use system fonts for best platform integration
const SFProText_Regular = Platform.select({ ios: 'System', android: 'sans-serif' });
const SFProText_Medium = Platform.select({ ios: 'System', android: 'sans-serif-medium' });
const SFProText_Semibold = Platform.select({ ios: 'System', android: 'sans-serif-medium' }); // Often maps to medium on Android
const SFProText_Bold = Platform.select({ ios: 'System', android: 'sans-serif-bold' });

const SFMono_Regular = Platform.select({ ios: 'Menlo-Regular', android: 'monospace' }); // Menlo is common on iOS for mono
const SFMono_Medium = Platform.select({ ios: 'Menlo-Regular', android: 'monospace' }); // Monospace often lacks weights

export const TYPOGRAPHY: Record<string, TextStyle> = {
    // iOS Style Guide Naming Convention
    largeTitle: { fontFamily: SFProText_Regular, fontSize: 34, fontWeight: 'bold', lineHeight: 41, letterSpacing: Platform.OS === 'ios' ? 0.37 : undefined, color: COLORS.textPrimary },
    title1: { fontFamily: SFProText_Regular, fontSize: 28, fontWeight: 'bold', lineHeight: 34, letterSpacing: Platform.OS === 'ios' ? 0.36 : undefined, color: COLORS.textPrimary },
    title2: { fontFamily: SFProText_Regular, fontSize: 22, fontWeight: 'bold', lineHeight: 28, letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined, color: COLORS.textPrimary },
    title3: { fontFamily: SFProText_Regular, fontSize: 20, fontWeight: '600', lineHeight: 25, letterSpacing: Platform.OS === 'ios' ? 0.38 : undefined, color: COLORS.textPrimary }, // Semibold

    headline: { fontFamily: SFProText_Regular, fontSize: 17, fontWeight: '600', lineHeight: 22, letterSpacing: Platform.OS === 'ios' ? -0.41 : undefined, color: COLORS.textPrimary }, // Semibold
    body: { fontFamily: SFProText_Regular, fontSize: 17, fontWeight: '400', lineHeight: 22, letterSpacing: Platform.OS === 'ios' ? -0.41 : undefined, color: COLORS.textPrimary }, // Regular
    bodyBold: { fontFamily: SFProText_Regular, fontSize: 17, fontWeight: '600', lineHeight: 22, letterSpacing: Platform.OS === 'ios' ? -0.41 : undefined, color: COLORS.textPrimary }, // Semibold

    callout: { fontFamily: SFProText_Regular, fontSize: 16, fontWeight: '400', lineHeight: 21, letterSpacing: Platform.OS === 'ios' ? -0.32 : undefined, color: COLORS.textPrimary },
    subhead: { fontFamily: SFProText_Regular, fontSize: 15, fontWeight: '400', lineHeight: 20, letterSpacing: Platform.OS === 'ios' ? -0.24 : undefined, color: COLORS.textSecondary },
    footnote: { fontFamily: SFProText_Regular, fontSize: 13, fontWeight: '400', lineHeight: 18, letterSpacing: Platform.OS === 'ios' ? -0.08 : undefined, color: COLORS.textSecondary }, // For secondary list text (date, payer, balance desc)
    caption1: { fontFamily: SFProText_Regular, fontSize: 12, fontWeight: '400', lineHeight: 16, letterSpacing: 0, color: COLORS.textSecondary },
    caption2: { fontFamily: SFProText_Regular, fontSize: 11, fontWeight: '400', lineHeight: 13, letterSpacing: Platform.OS === 'ios' ? 0.06 : undefined, color: COLORS.textSecondary },

    // Section Header (Uppercase)
    sectionHeader: { fontFamily: SFProText_Regular, fontSize: 13, fontWeight: '400', lineHeight: 18, letterSpacing: Platform.OS === 'ios' ? -0.08 : undefined, color: COLORS.textSecondary, textTransform: 'uppercase' },

    // Monospace Styles
    monoBody: { fontFamily: SFMono_Regular, fontSize: 17, fontWeight: '400', lineHeight: 22, letterSpacing: Platform.OS === 'ios' ? -0.41 : undefined, color: COLORS.textPrimary },
    monoFootnote: { fontFamily: SFMono_Regular, fontSize: 13, fontWeight: '400', lineHeight: 18, letterSpacing: Platform.OS === 'ios' ? -0.08 : undefined, color: COLORS.textSecondary },

    // Button Text Styles
    buttonPrimary: { fontFamily: SFProText_Regular, fontSize: 17, fontWeight: '600', color: COLORS.primaryAccent }, // Semibold
    buttonSecondary: { fontFamily: SFProText_Regular, fontSize: 17, fontWeight: '400', color: COLORS.primaryAccent }, // Regular
    buttonDestructive: { fontFamily: SFProText_Regular, fontSize: 17, fontWeight: '400', color: COLORS.error },
    buttonDisabled: { fontFamily: SFProText_Regular, fontSize: 17, fontWeight: '600', color: COLORS.disabled },
};

export type TextVariant = keyof typeof TYPOGRAPHY;
export type TypographyStyle = TextStyle;
