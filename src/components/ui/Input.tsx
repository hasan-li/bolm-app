// src/components/ui/Input.tsx
import React, { useState } from 'react';
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
                                                onFocus,
                                                onBlur,
                                                ...rest
                                            }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text variant="footnote" color={COLORS.textSecondary} style={styles.label}>
                    {label}
                </Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    error ? styles.inputError : null,
                    style,
                ]}
                placeholderTextColor={COLORS.placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
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
        marginBottom: 20,
    },
    label: {
        marginBottom: 6,
        paddingHorizontal: 4,
    },
    input: {
        height: Platform.OS === 'ios' ? 44 : 48,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8, // Consistent rounding
        backgroundColor: COLORS.inputBackground,
        color: COLORS.textPrimary,
        fontSize: TYPOGRAPHY.body.fontSize,
        // Subtle shadow for depth
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0,0.1)',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 1,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    inputFocused: {
        borderColor: COLORS.primaryAccent, // Blue border on focus
        // Optional: Slightly stronger shadow on focus
        ...Platform.select({
            ios: {
                shadowColor: COLORS.primaryAccent,
                shadowOpacity: 0.2,
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    inputError: {
        borderColor: COLORS.error, // Red border on error
    },
    errorText: {
        marginTop: 4,
        paddingHorizontal: 4,
    },
});
