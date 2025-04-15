// src/components/ui/Button.tsx
import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    StyleProp,
    TextStyle,
    Platform,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Text } from './Text';
import { TYPOGRAPHY, TextVariant } from '../../constants/typography';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'destructive' | 'text' | 'pill'; // Added 'pill'
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
    const isPill = variant === 'pill';

    const getTextColor = () => {
        if (isDisabled) {
            // For pill buttons, disabled text is lighter on a disabled background
            // For text buttons, disabled text is just the disabled color
            return isPill ? COLORS.textTertiary : COLORS.disabled;
        }
        switch (variant) {
            case 'primary':
            case 'secondary': // iOS often uses blue for secondary text buttons too
            case 'text':
                return COLORS.primaryAccent;
            case 'pill':
                return COLORS.card; // White text on pill
            case 'destructive':
                return COLORS.error;
            default:
                return COLORS.primaryAccent;
        }
    };

    const getTextVariant = (): TextVariant => {
        // Use specific button typography variants based on TYPOGRAPHY constants
        switch (variant) {
            case 'primary':
            case 'pill': // Pill uses primary styling (semibold)
                return isDisabled ? 'buttonDisabled' : 'buttonPrimary';
            case 'destructive':
                return isDisabled ? 'buttonDisabled' : 'buttonDestructive'; // Need a disabled destructive style?
            case 'secondary':
            case 'text':
            default:
                return isDisabled ? 'buttonDisabled' : 'buttonSecondary'; // Regular weight
        }
    };

    const getButtonBackground = () => {
        if (isPill) {
            return isDisabled ? COLORS.disabledBackground : COLORS.primaryAccent;
        }
        return COLORS.transparent; // Text buttons are transparent
    };

    return (
        <TouchableOpacity
            style={[
                styles.buttonBase,
                isPill && styles.pillShape,
                { backgroundColor: getButtonBackground() },
                // Opacity is handled via text color for text buttons, background for pills
                isDisabled && !isPill && styles.disabledOpacity,
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.6} // Standard dimming on press
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={getTextColor()} />
            ) : (
                <Text
                    // Use the determined variant (handles disabled style via TYPOGRAPHY)
                    variant={getTextVariant()}
                    // Override color specifically for non-pill disabled state if needed,
                    // otherwise rely on TYPOGRAPHY variant color
                    style={[
                        { color: getTextColor() }, // Ensure correct color is applied
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
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: Platform.OS === 'ios' ? 44 : 36,
        borderRadius: 8, // Default subtle rounding
    },
    pillShape: {
        borderRadius: 22, // Half of minHeight for perfect pill
        paddingHorizontal: 24, // More padding for pills
    },
    disabledOpacity: { // Only for non-pill disabled buttons
        opacity: 0.4,
    },
});
