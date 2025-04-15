// src/components/ui/Card.tsx
import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { COLORS } from '../../constants/colors';

interface CardProps extends ViewProps {
    padded?: boolean;
    noMargin?: boolean;
}

export const Card: React.FC<CardProps> = ({
                                              padded = true, // Default to padded
                                              noMargin = false,
                                              style,
                                              children,
                                              ...rest
                                          }) => {
    return (
        <View
            style={[
                styles.card,
                padded && styles.padded,
                noMargin && styles.noMargin,
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
        backgroundColor: COLORS.card, // White background
        borderRadius: 10, // Consistent rounded corners
        marginBottom: 16, // Default spacing below card
        // Subtle shadow for depth
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0,0.6)', // Slightly darker shadow color
                shadowOffset: { width: 0, height: 2 }, // Slightly more offset
                shadowOpacity: 0.1, // Lower opacity
                shadowRadius: 4, // Larger radius for softer shadow
            },
            android: {
                elevation: 2, // Subtle elevation
            },
        }),
    },
    padded: {
        padding: 16,
    },
    noMargin: {
        marginBottom: 0,
    },
});
