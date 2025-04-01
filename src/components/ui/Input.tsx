// src/components/ui/Input.tsx
import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TextInputProps,
    ViewStyle,
    StyleProp,
    Platform,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Text } from './Text';
import { TYPOGRAPHY } from '../../constants/typography';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
}

export const Input: React.FC<InputProps> = ({
                                                label,
                                                error,
                                                style,
                                                containerStyle,
                                                ...rest
                                            }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text variant="caption1" color={COLORS.textSecondary} style={styles.label}>
                    {label.toUpperCase()} {/* Uppercase label */}
                </Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                    style,
                ]}
                placeholderTextColor={COLORS.placeholder}
                {...rest}
            />
            {error && (
                <Text variant="caption1" color={COLORS.error} style={styles.errorText}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24, // More spacing
    },
    label: {
        marginBottom: 8,
        letterSpacing: 0.5, // Add letter spacing to label
    },
    input: {
        height: 40, // Slightly reduced height
        paddingHorizontal: 0, // No horizontal padding needed for underline style
        paddingBottom: 8, // Padding below text
        borderBottomWidth: 1, // Use bottom border only
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.transparent, // Transparent background
        color: COLORS.textPrimary,
        fontSize: TYPOGRAPHY.body.fontSize,
        borderRadius: 0, // Sharp corners
    },
    inputError: {
        borderBottomColor: COLORS.error,
    },
    errorText: {
        marginTop: 6,
    },
});
