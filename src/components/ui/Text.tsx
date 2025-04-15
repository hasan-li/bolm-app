// src/components/ui/Text.tsx
import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY, TextVariant } from '../../constants/typography'; // Import TextVariant type

interface CustomTextProps extends TextProps {
    variant?: TextVariant;
    color?: string; // Allow overriding color
    center?: boolean;
}

export const Text: React.FC<CustomTextProps> = ({
                                                    variant = 'body',
                                                    color,
                                                    center = false,
                                                    style,
                                                    children,
                                                    ...rest
                                                }) => {
    const baseStyle = TYPOGRAPHY[variant] || TYPOGRAPHY.body;
    // Use color from prop, then from TYPOGRAPHY definition, then fallback
    const finalColor = color ?? baseStyle.color ?? COLORS.textPrimary;

    return (
        <RNText
            style={[
                baseStyle, // Apply variant styles (includes font, size, weight, and default color)
                { color: finalColor }, // Apply the determined color
                center && styles.center,
                style, // Apply custom styles last
            ]}
            {...rest}
        >
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    center: {
        textAlign: 'center',
    },
});
