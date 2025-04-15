// src/app/(app)/group/[id].tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Platform,
    Dimensions,
    Modal,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button'; // Keep for header button if needed elsewhere
import { ExpenseCard } from '../../../components/expenses/ExpenseCard';
import { Card } from '../../../components/ui/Card';
import { useExpensesStore } from '../../../store/expensesStore';
// Import store hooks if you intend to switch later
// import { useGroupsStore } from '../../store/groupsStore';
// import { useExpensesStore } from '../../store/expensesStore';
import { COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Expense } from '../../../types/expense';
import { Group } from '../../../types/group';
import { Ionicons } from '@expo/vector-icons';
import {useAuthStore} from "../../../store/authStore";

// --- Helper Functions ---
const getDateDaysAgo = (daysAgo: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0);
    return date;
};

const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- Mock Data for this Screen ---
const generateMockExpenses = (): Expense[] => {
    // console.log("Generating Mock Expenses..."); // Keep for debugging
    return [
        { id: 'e1', description: 'Flights to Paris', amount: 350.00, date: getDateDaysAgo(6).toISOString(), paidByUserId: 'user1', paidByName: 'You', groupId: '1' },
        { id: 'e3', description: 'Paris Hotel (Night 1)', amount: 120.50, date: getDateDaysAgo(5).toISOString(), paidByUserId: 'user2', paidByName: 'Taylor Kim', groupId: '1' },
        { id: 'e6', description: 'Museum Tickets', amount: 45.00, date: getDateDaysAgo(4).toISOString(), paidByUserId: 'user1', paidByName: 'You', groupId: '1' },
        { id: 'e2', description: 'Weekly Groceries', amount: 85.75, date: getDateDaysAgo(3).toISOString(), paidByUserId: 'user2', paidByName: 'Taylor Kim', groupId: '2' },
        { id: 'e4', description: 'Internet Bill', amount: 60.00, date: getDateDaysAgo(2).toISOString(), paidByUserId: 'user1', paidByName: 'You', groupId: '2' },
        { id: 'e5', description: 'Takeout Pizza', amount: 32.00, date: getDateDaysAgo(1).toISOString(), paidByUserId: 'user2', paidByName: 'Taylor Kim', groupId: '2' },
        { id: 'e7', description: 'Movie Night Snacks', amount: 25.00, date: getDateDaysAgo(0).toISOString(), paidByUserId: 'user1', paidByName: 'You', groupId: '2' },
        { id: 'e8', description: 'Old Coffee', amount: 5.00, date: getDateDaysAgo(8).toISOString(), paidByUserId: 'user1', paidByName: 'You', groupId: '2' },
    ];
};

// Define initial data outside the component
const initialExpenses: Expense[] = generateMockExpenses();

const initialGroups: Group[] = [
    { id: '1', name: 'March Vacation', expenses: initialExpenses.filter(e => e.groupId === '1') },
    { id: '2', name: 'Roommates', expenses: initialExpenses.filter(e => e.groupId === '2') },
    { id: '3', name: 'Project Phoenix', expenses: [] },
];
const MOCK_EXPENSES_GROUP_1: Expense[] = [
    { id: 'e1', description: 'Groceries', amount: 75.50, date: getDateDaysAgo(2).toISOString(), paidByUserId: 'user1', paidByName: 'You', groupId: '1' },
    { id: 'e2', description: 'Dinner Out', amount: 120.00, date: getDateDaysAgo(1).toISOString(), paidByUserId: 'user2', paidByName: 'Taylor Kim', groupId: '1' },
    { id: 'e3', description: 'Taxi Home', amount: 25.00, date: getDateDaysAgo(1).toISOString(), paidByUserId: 'user1', paidByName: 'You', groupId: '1' },
    { id: 'e9', description: 'Coffee', amount: 4.75, date: getDateDaysAgo(0).toISOString(), paidByUserId: 'user2', paidByName: 'Taylor Kim', groupId: '1' },
];

const MOCK_BALANCES_GROUP_1 = [
    { userId: 'user2', userName: 'Taylor Kim', amount: -12.13 },
];

const MOCK_GROUP_DETAILS: Group = {
    id: '1',
    name: 'March Vacation',
    expenses: MOCK_EXPENSES_GROUP_1,
};

const MOCK_USER = { id: 'user1' };
// --- End Mock Data ---


export default function GroupDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // --- State Management ---
    const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [balances, setBalances] = useState<typeof MOCK_BALANCES_GROUP_1>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionModalVisible, setActionModalVisible] = useState(false);
    const { user } = useAuthStore();
    const currentUser = user || MOCK_USER;

    // --- Data Loading Simulation ---
    useEffect(() => {
        setIsLoading(true);
        // console.log(`GroupDetailsScreen: Simulating load for group ID: ${id}`);
        const timer = setTimeout(() => {
            // Find group details (in real app, fetch from store/API based on id)
            const groupData = initialGroups.find(g => g.id === id) || MOCK_GROUP_DETAILS; // Fallback for testing
            const groupExpensesData = initialExpenses.filter(e => e.groupId === id);
            // Calculate balances based on fetched/mock expenses
            const calculatedBalances = calculateMyGroupBalanceForGroup(groupExpensesData, currentUser?.id);

            setCurrentGroup(groupData);
            setExpenses(groupExpensesData);
            setBalances(calculatedBalances); // Use calculated balances
            setIsLoading(false);
            // console.log("GroupDetailsScreen: Mock data loaded.");
        }, 100);
        return () => clearTimeout(timer);
    }, [id, currentUser?.id]); // Rerun if ID or user changes

    // --- Event Handlers ---
    const handleAddExpense = () => {
        setActionModalVisible(false);
        router.push({
            pathname: '/(app)/add-expense',
            params: { groupId: id, groupName: currentGroup?.name },
        });
    };

    // --- Balance Display Logic ---
    // Refined balance calculation for potentially more than 2 members
    const calculateMyGroupBalanceForGroup = (
        groupExpenses: Expense[] | undefined,
        myUserId: string | undefined
    ): Array<{ userId: string; userName: string; amount: number }> => {
        if (!groupExpenses || groupExpenses.length === 0 || !myUserId) {
            return [];
        }

        // In a real app, get members from group details or a separate store/API call
        const members = [
            { id: 'user1', name: 'You' },
            { id: 'user2', name: 'Taylor Kim' },
            // Add more mock members if needed for testing
        ];
        const numMembers = members.length;
        if (numMembers === 0) return [];

        const memberBalances: { [key: string]: number } = {};
        members.forEach(m => memberBalances[m.id] = 0);

        groupExpenses.forEach(expense => {
            const amount = expense.amount;
            const paidById = expense.paidByUserId;
            const sharePerMember = amount / numMembers; // Assuming equal split

            // Add credit to payer
            if (memberBalances.hasOwnProperty(paidById)) {
                memberBalances[paidById] += amount;
            }

            // Add debit to everyone's share
            members.forEach(member => {
                if (memberBalances.hasOwnProperty(member.id)) {
                    memberBalances[member.id] -= sharePerMember;
                }
            });
        });

        // Format for display, excluding the current user
        const formattedBalances = members
            .filter(member => member.id !== myUserId)
            .map(member => ({
                userId: member.id,
                userName: member.name,
                amount: memberBalances[member.id] // Positive: they owe you, Negative: you owe them
            }))
            .filter(balance => Math.abs(balance.amount) >= 0.01); // Filter out zero balances

        return formattedBalances;
    };


    const getBalanceDisplay = (balance: {
        userId: string;
        userName: string;
        amount: number;
    }) => {
        const amountAbs = Math.abs(balance.amount).toFixed(2);
        if (balance.amount > 0) { // Positive means they owe you
            return { text: `Owes you $${amountAbs}`, color: COLORS.success };
        } else if (balance.amount < 0) { // Negative means you owe them
            return { text: `You owe $${amountAbs}`, color: COLORS.error };
        } else {
            // This case should be filtered out by calculateMyGroupBalanceForGroup
            return { text: `Settled up`, color: COLORS.textSecondary };
        }
    };

    // --- Render Logic ---
    if (isLoading) { // Simplified loading check
        return (
            <SafeAreaView style={styles.safeArea}>
                <Stack.Screen options={{ title: 'Loading...' }} />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={COLORS.textSecondary} />
                </View>
            </SafeAreaView>
        );
    }

    if (!currentGroup) { // Handle group not found
        return (
            <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
                <Stack.Screen options={{ title: 'Error' }} />
                <View style={styles.centered}>
                    <Text color={COLORS.error}>Group not found.</Text>
                    <Button title="Go Back" onPress={() => router.back()} variant="text" />
                </View>
            </SafeAreaView>
        );
    }

    // Determine if sections should show empty states *after* loading
    const showEmptyBalances = balances.length === 0;
    const showEmptyExpenses = expenses.length === 0;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <Stack.Screen
                options={{
                    title: currentGroup.name,
                    headerTitleStyle: {
                        ...TYPOGRAPHY.headline,
                        color: COLORS.textPrimary,
                    },
                    // Header Right button removed, using FAB instead
                    headerStyle: { backgroundColor: COLORS.background },
                    headerShadowVisible: false,
                    headerBackTitleVisible: false,
                    headerTintColor: COLORS.primaryAccent,
                }}
            />

            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ExpenseCard expense={item} currentUserId={currentUser?.id || ''} />
                )}
                ListHeaderComponent={
                    <View style={styles.listHeader}>
                        <Text variant="sectionHeader" style={styles.sectionTitle}>
                            Balances
                        </Text>
                        <Card style={styles.balancesCard} padded={false}>
                            {showEmptyBalances ? (
                                <View style={styles.placeholderPadded}>
                                    <Text color={COLORS.textSecondary} style={styles.placeholderText}>
                                        {showEmptyExpenses
                                            ? 'No balances to show yet.'
                                            : 'Everyone is settled up.'}
                                    </Text>
                                </View>
                            ) : (
                                balances.map((balance, index) => {
                                    const display = getBalanceDisplay(balance);
                                    return (
                                        <View key={balance.userId} style={[styles.balanceRow, index === balances.length - 1 ? styles.balanceRowLast : null]}>
                                            <Text variant="body">{balance.userName}</Text>
                                            <Text variant="body" color={display.color}>
                                                {display.text}
                                            </Text>
                                        </View>
                                    );
                                })
                            )}
                        </Card>

                        <Text variant="sectionHeader" style={styles.sectionTitle}>
                            Expenses
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    showEmptyExpenses ? (
                        <View style={styles.placeholderContainer}>
                            <Text color={COLORS.textSecondary} style={styles.placeholderText}>
                                No expenses yet. Tap the '+' button below to add one.
                            </Text>
                        </View>
                    ) : null
                }
                style={styles.list}
                contentContainerStyle={[styles.listContentContainer, { paddingBottom: 80 + insets.bottom }]} // Padding for FAB
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                style={[styles.fab, { bottom: insets.bottom + 16 }]}
                onPress={() => setActionModalVisible(true)}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={28} color={COLORS.card} />
            </TouchableOpacity>

            {/* Action Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isActionModalVisible}
                onRequestClose={() => setActionModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setActionModalVisible(false)}
                >
                    <SafeAreaView edges={['bottom']} style={styles.modalSafeArea}>
                        <Pressable onPress={() => {}}>
                            {/* Prevent closing modal by tapping content */}
                            <View style={styles.modalContent}>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.modalActionItem,
                                        pressed && styles.modalActionItemPressed,
                                    ]}
                                    onPress={handleAddExpense}
                                >
                                    <Ionicons name="receipt-outline" size={22} color={COLORS.primaryAccent} style={styles.modalActionIcon} />
                                    <Text variant="body" color={COLORS.primaryAccent}>Add Expense</Text>
                                </Pressable>
                                {/* Add other actions here (e.g., Record Payment) */}
                                <View style={styles.modalSeparator} />
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.modalActionItem,
                                        styles.modalCancelItem,
                                        pressed && styles.modalActionItemPressed,
                                    ]}
                                    onPress={() => setActionModalVisible(false)}
                                >
                                    <Text variant="bodyBold" color={COLORS.primaryAccent}>Cancel</Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    </SafeAreaView>
                </Pressable>
            </Modal>

        </SafeAreaView>
    );
}

// --- Styles (Using styles from Reply #8) ---
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
        backgroundColor: COLORS.background,
    },
    listContentContainer: {
        paddingHorizontal: 16,
        flexGrow: 1,
        // paddingBottom is dynamic based on FAB
    },
    listHeader: {
        paddingBottom: 8,
    },
    sectionTitle: {
        marginTop: 24,
        marginBottom: 12,
        // paddingHorizontal: 16, // Handled by list container
    },
    balancesCard: {
        // marginHorizontal: 16, // Handled by list container
        marginBottom: 16,
    },
    inlineLoader: {
        paddingVertical: 16,
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.separator,
    },
    balanceRowLast: {
        borderBottomWidth: 0,
    },
    placeholderContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    placeholderPadded: {
        padding: 16,
        alignItems: 'center',
    },
    placeholderText: {
        textAlign: 'center',
        lineHeight: 20,
        fontSize: TYPOGRAPHY.body.fontSize,
    },
    headerButton: { // Kept for potential future use
        marginRight: Platform.OS === 'ios' ? 16 : 10,
    },
    fab: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: COLORS.primaryAccent,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.modalBackdrop,
        justifyContent: 'flex-end',
    },
    modalSafeArea: {
        backgroundColor: COLORS.transparent,
    },
    modalContent: {
        backgroundColor: Platform.OS === 'ios' ? 'rgba(249, 249, 249, 0.9)' : COLORS.background, // iOS Action Sheet style bg
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingTop: 10,
        marginHorizontal: 8,
        overflow: 'hidden',
    },
    modalActionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        backgroundColor: Platform.OS === 'ios' ? COLORS.transparent : COLORS.card, // iOS uses transparent bg for items
        borderRadius: Platform.OS === 'ios' ? 0 : 10, // No radius for iOS items
        marginHorizontal: Platform.OS === 'ios' ? 0 : 8, // No horizontal margin for iOS items
    },
    modalActionItemPressed: {
        backgroundColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.05)' : COLORS.separator, // Subtle pressed state
    },
    modalActionIcon: {
        marginRight: 10,
    },
    modalSeparator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: COLORS.border,
        marginHorizontal: Platform.OS === 'ios' ? 0 : 8, // No horizontal margin for iOS separator
    },
    modalCancelItem: {
        marginTop: 8,
        marginBottom: 10,
        borderRadius: 10, // Round corners for cancel button block
        marginHorizontal: 8, // Margin for cancel button block
        backgroundColor: COLORS.card, // White background for cancel block
    },
});
