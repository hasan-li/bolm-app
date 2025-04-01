// src/components/ui/Text.tsx
import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY, TextVariant } from '../../constants/typography'; // Import TextVariant type

interface CustomTextProps extends TextProps {
    variant?: TextVariant; // Use the imported type
    color?: string;
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

    // Determine the final color: Use provided color > variant default > fallback
    // Note: Button colors are primarily set in the Button component itself now
    const finalColor = color ?? baseStyle.color ?? COLORS.textPrimary;

    return (
        <RNText
            style={[
                baseStyle,
                { color: finalColor },
                center && styles.center,
                style,
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
