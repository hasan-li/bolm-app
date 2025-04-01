// src/components/ui/Card.tsx
// Make it essentially a View with optional padding, no default styling
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { COLORS } from '../../constants/colors';

interface CardProps extends ViewProps {
    padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
                                              padded = false, // Default to no padding
                                              style,
                                              children,
                                              ...rest
                                          }) => {
    return (
        <View
            style={[
                styles.card,
                padded && styles.padded,
                style,
            ]}
            {...rest}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        // No default background, border, or margin.
        // Let the screen/component using it define these if needed.
    },
    padded: {
        padding: 16,
    },
});
