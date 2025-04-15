// src/components/expenses/ExpenseCard.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from '../ui/Text';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { Expense } from '../../types/expense';
// import { Ionicons } from '@expo/vector-icons'; // Optional icon import

// Helper function (can be moved to a utils file)
const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

interface ExpenseCardProps {
    expense: Expense;
    currentUserId: string;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
                                                            expense,
                                                            currentUserId
                                                        }) => {
    const { description, amount, paidByUserId, paidByName, date } = expense;

    const expenseDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let formattedDate: string;
    if (formatDateKey(expenseDate) === formatDateKey(today)) {
        formattedDate = 'Today';
    } else if (formatDateKey(expenseDate) === formatDateKey(yesterday)) {
        formattedDate = 'Yesterday';
    } else {
        formattedDate = expenseDate.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        });
    }

    const isCurrentUserPayer = paidByUserId === currentUserId;
    const payerText = isCurrentUserPayer ? 'You paid' : `${paidByName} paid`;
    const amountColor = isCurrentUserPayer ? COLORS.success : COLORS.error;

    return (
        <View style={styles.cardContainer}>
            <View style={styles.contentContainer}>
                {/* Optional Icon */}
                {/* <View style={styles.iconContainer}><Ionicons name="receipt-outline" size={20} color={COLORS.textSecondary} /></View> */}
                <View style={styles.infoContainer}>
                    <Text variant="body" style={styles.description} numberOfLines={1}>
                        {description}
                    </Text>
                    <Text variant="footnote" color={COLORS.textSecondary}>
                        {payerText} • {formattedDate}
                    </Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text variant="monoBody" color={amountColor}>
                        ${amount.toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: COLORS.card,
        borderRadius: 10,
        marginBottom: 10, // Space between expense cards
        // No horizontal margin needed if list container has padding
        // Subtle shadow
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0,0.6)',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    // iconContainer: { marginRight: 12, alignItems: 'center', justifyContent: 'center' },
    infoContainer: {
        flex: 1,
        marginRight: 10,
    },
    description: {
        color: COLORS.textPrimary,
        marginBottom: 3,
        fontWeight: '500',
    },
    amountContainer: {
        alignItems: 'flex-end',
        minWidth: 70,
    },
});
