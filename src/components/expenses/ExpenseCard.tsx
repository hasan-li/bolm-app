// src/components/expenses/ExpenseCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { COLORS } from '../../constants/colors';
import { Expense } from '../../types/expense';

interface ExpenseCardProps {
    expense: Expense;
    currentUserId: string;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
                                                            expense,
                                                            currentUserId
                                                        }) => {
    const { description, amount, paidByUserId, paidByName, date } = expense;
    const formattedDate = new Date(date).toLocaleDateString('en-GB', { // Example: DD/MM/YYYY
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const isCurrentUserPayer = paidByUserId === currentUserId;
    const payerText = isCurrentUserPayer ? 'You paid' : `${paidByName} paid`;
    // Use neutral colors for amount, rely on sign +/-
    const amountColor = COLORS.textPrimary; // isCurrentUserPayer ? COLORS.success : COLORS.error;
    const amountPrefix = isCurrentUserPayer ? '+' : '-';

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text variant="body" style={styles.description}>
                    {description}
                </Text>
                <Text variant="footnote" color={COLORS.textSecondary}>
                    {payerText} • {formattedDate} {/* Combine payer and date */}
                </Text>
            </View>

            <View style={styles.amountContainer}>
                {/* Use monoBody for the amount */}
                <Text variant="monoBody" color={amountColor}>
                    {amountPrefix}${amount.toFixed(2)}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: COLORS.transparent, // Transparent background
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.border,
    },
    infoContainer: {
        flex: 1,
        marginRight: 10,
    },
    description: {
        color: COLORS.textPrimary,
        marginBottom: 4,
        fontWeight: '500',
    },
    amountContainer: {
        alignItems: 'flex-end',
        minWidth: 80, // Ensure enough space for amount alignment
    },
    // Removed paidBy style
});
