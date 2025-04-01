// src/components/ui/Button.tsx
import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    StyleProp,
    TextStyle,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Text } from './Text'; // Use your custom Text component

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'destructive' | 'text'; // Added 'text' variant
    isLoading?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
                                                  title,
                                                  onPress,
                                                  variant = 'primary',
                                                  isLoading = false,
                                                  disabled = false,
                                                  style,
                                                  textStyle,
                                              }) => {
    const isDisabled = isLoading || disabled;

    const getTextColor = () => {
        if (isDisabled) return COLORS.disabled;
        switch (variant) {
            case 'primary':
                return COLORS.primaryAccent;
            case 'secondary':
            case 'text':
                return COLORS.textSecondary;
            case 'destructive':
                return COLORS.error;
            default:
                return COLORS.primaryAccent;
        }
    };

    const getTextVariant = (): keyof typeof TYPOGRAPHY => {
        switch (variant) {
            case 'primary':
                return 'buttonPrimary';
            case 'destructive':
                return 'buttonDestructive';
            case 'secondary':
            case 'text':
            default:
                return 'buttonSecondary';
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.buttonBase,
                isDisabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.6}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={getTextColor()} />
            ) : (
                <Text
                    variant={getTextVariant()}
                    style={[
                        { color: getTextColor() }, // Color is set here based on variant/state
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonBase: {
        paddingVertical: 10,
        paddingHorizontal: 12, // Slightly less padding maybe
        justifyContent: 'center',
        alignItems: 'center',
        // No background or border
    },
    disabled: {
        opacity: 0.4,
    },
});