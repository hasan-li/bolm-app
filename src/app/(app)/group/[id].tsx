// src/app/(app)/group/[id].tsx
import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import { ExpenseCard } from '../../../components/expenses/ExpenseCard';
import { useGroupsStore } from '../../../store/groupsStore';
import { useExpensesStore } from '../../../store/expensesStore';
import { useAuthStore } from '../../../store/authStore';
import { COLORS } from '../../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data (keep for testing if needed)
const MOCK_GROUP = { id: '1', name: 'March Vacation', expenses: [
        { id: 'e1', description: 'Groceries', amount: 75.50, date: '2025-03-30', paidByUserId: 'user1', paidByName: 'You' },
        { id: 'e2', description: 'Dinner', amount: 120.00, date: '2025-03-30', paidByUserId: 'user2', paidByName: 'Taylor Kim' },
        { id: 'e3', description: 'Taxi', amount: 25.00, date: '2025-03-29', paidByUserId: 'user1', paidByName: 'You' },
    ]};
const MOCK_BALANCES = [
    { userId: 'user2', userName: 'Taylor Kim', amount: -22.25 },
    { userId: 'user3', userName: 'Alex Smith', amount: 15.00 },
];
const MOCK_USER = { id: 'user1' };

export default function GroupDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    // Replace with actual store hooks
    const user = MOCK_USER;
    const currentGroup = MOCK_GROUP;
    const groupLoading = false;
    const expenses = MOCK_GROUP.expenses;
    const balances = MOCK_BALANCES;
    const expensesLoading = false;
    // const { fetchGroupDetails } = useGroupsStore();
    // const { fetchExpenses, calculateBalances } = useExpensesStore();

    // useEffect(() => { ... }, []); // Keep data fetching logic

    const handleAddExpense = () => {
        router.push({
            pathname: '/(app)/add-expense',
            params: { groupId: id, groupName: currentGroup?.name }, // Pass group name
        });
    };

    const isLoading = groupLoading || expensesLoading;

    if (isLoading && !currentGroup) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primaryAccent} />
            </View>
        );
    }

    if (!currentGroup) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
                <Stack.Screen options={{ title: 'Error' }} />
                <View style={styles.centered}>
                    <Text color={COLORS.error}>Group not found</Text>
                    <Button title="Go Back" onPress={() => router.back()} variant="text" />
                </View>
            </SafeAreaView>
        );
    }

    const getBalanceDisplay = (balance: {
        userId: string;
        userName: string;
        amount: number;
    }) => {
        const amountAbs = Math.abs(balance.amount).toFixed(2);
        if (balance.amount > 0) {
            return {
                text: `owes you $${amountAbs}`,
                color: COLORS.success,
            };
        } else if (balance.amount < 0) {
            return { text: `you owe $${amountAbs}`, color: COLORS.error };
        } else {
            return { text: `Settled up`, color: COLORS.textSecondary };
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <Stack.Screen
                options={{
                    title: currentGroup.name,
                    headerRight: () => (
                        <Button
                            title="+ Add Expense"
                            onPress={handleAddExpense}
                            variant="primary"
                            style={styles.headerButton}
                        />
                    ),
                    // Inherits header style from layout
                }}
            />

            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ExpenseCard expense={item} currentUserId={user?.id || ''} />
                )}
                ListHeaderComponent={
                    <View style={styles.listHeader}>
                        {/* Balances Section */}
                        <Text variant="title3Uppercase" style={styles.sectionTitle}>
                            Balances
                        </Text>
                        <View style={styles.sectionContainer}>
                            {isLoading && expenses.length > 0 ? (
                                <ActivityIndicator size="small" color={COLORS.textSecondary} />
                            ) : balances.length === 0 ? (
                                <Text color={COLORS.textSecondary} style={styles.placeholderText}>
                                    {expenses.length === 0
                                        ? 'No balances to show yet.'
                                        : 'Everyone is settled up.'}
                                </Text>
                            ) : (
                                balances.map((balance, index) => {
                                    const display = getBalanceDisplay(balance);
                                    return (
                                        <View key={balance.userId} style={[styles.balanceRow, index === balances.length - 1 ? styles.balanceRowLast : null]}>
                                            <Text variant="bodyBold">{balance.userName}</Text>
                                            <Text variant="monoBody" color={display.color}>
                                                {display.text}
                                            </Text>
                                        </View>
                                    );
                                })
                            )}
                        </View>

                        {/* Expenses Section */}
                        <Text variant="title3Uppercase" style={styles.sectionTitle}>
                            Expenses
                        </Text>
                        {/* No container needed if ExpenseCard handles its own padding/borders */}
                    </View>
                }
                ListEmptyComponent={
                    !isLoading && expenses.length === 0 ? (
                        <View style={styles.placeholderContainer}>
                            <Text color={COLORS.textSecondary} style={styles.placeholderText}>
                                No expenses yet. Tap "+ Add Expense" to get started.
                            </Text>
                        </View>
                    ) : null
                }
                style={styles.list}
                contentContainerStyle={styles.listContentContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: 20,
    },
    list: {
        flex: 1,
    },
    listContentContainer: {
        paddingBottom: 20, // Space at the end of the list
    },
    listHeader: {
        // Container for headers, allows consistent padding if needed
    },
    sectionTitle: {
        marginTop: 30, // More space between sections
        marginBottom: 10,
        paddingHorizontal: 16,
    },
    sectionContainer: { // Container for balances list items
        paddingHorizontal: 16, // Indent balance items
        marginBottom: 16, // Space below balances section before next title
    },
    balancesContainer: { // Renamed from sectionContainer for clarity if needed elsewhere
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12, // Adjust spacing
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.border,
    },
    balanceRowLast: {
        borderBottomWidth: 0,
    },
    placeholderContainer: {
        paddingVertical: 30, // More padding for empty state
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    placeholderText: {
        textAlign: 'center',
        lineHeight: 20,
    },
    headerButton: {
        // marginRight: Platform.OS === 'ios' ? 16 : 10, // Use platform specific margin
        paddingHorizontal: 0, // Make it feel more like text
    },
});
