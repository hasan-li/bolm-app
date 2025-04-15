// src/app/(app)/index.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Dimensions,
} from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { GroupSpendingChart } from '../../components/charts/GroupSpendingChart';
import { Card } from '../../components/ui/Card';
import { useGroupsStore } from '../../store/groupsStore';
import { useExpensesStore } from '../../store/expensesStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
// Import SafeAreaView
import { SafeAreaView } from 'react-native-safe-area-context';
import { Group } from '../../types/group';
import { Expense } from '../../types/expense';
import { Ionicons } from '@expo/vector-icons';

// --- Helper Functions (Keep as before) ---
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
const formatShortDateLabel = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
};

// --- Generate Dynamic Mock Data (Keep as before) ---
const generateMockExpenses = (): Expense[] => {
    // console.log("Generating Mock Expenses...");
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
const initialExpenses: Expense[] = generateMockExpenses();
const initialGroups: Group[] = [
    { id: '1', name: 'March Vacation', expenses: initialExpenses.filter(e => e.groupId === '1') },
    { id: '2', name: 'Roommates', expenses: initialExpenses.filter(e => e.groupId === '2') },
    { id: '3', name: 'Project Phoenix', expenses: [] },
];
const MOCK_USER = { id: 'user1' };

// --- Balance Calculation Helper (Keep as before) ---
const calculateMyGroupBalance = (
    groupExpenses: Expense[] | undefined,
    myUserId: string | undefined
): { text: string; color: string } => {
    if (!groupExpenses || groupExpenses.length === 0 || !myUserId) {
        return { text: '', color: COLORS.textSecondary };
    }
    let totalPaidByMe = 0;
    let totalMyShare = 0;
    const numMembers = 2; // Placeholder
    groupExpenses.forEach(expense => {
        const sharePerMember = expense.amount / numMembers;
        totalMyShare += sharePerMember;
        if (expense.paidByUserId === myUserId) {
            totalPaidByMe += expense.amount;
        }
    });
    const netBalance = totalPaidByMe - totalMyShare;
    if (Math.abs(netBalance) < 0.01) {
        return { text: 'Settled up', color: COLORS.textSecondary };
    } else if (netBalance > 0) {
        return { text: `You are owed $${netBalance.toFixed(2)}`, color: COLORS.success };
    } else {
        return { text: `You owe $${Math.abs(netBalance).toFixed(2)}`, color: COLORS.error };
    }
};

// --- Group List Item Component (Using Card) ---
interface GroupListItemProps {
    item: Group;
    balanceText: string;
    balanceColor: string;
}

const GroupListItem: React.FC<GroupListItemProps> = ({ item, balanceText, balanceColor }) => {
    return (
        <Card style={styles.groupItemCard} padded={false} noMargin>
            <Link href={`/(app)/group/${item.id}`} asChild>
                <TouchableOpacity style={styles.groupItemTouchable} activeOpacity={0.7}>
                    <View style={styles.groupInfoContainer}>
                        <Text variant="body" style={styles.groupNameText}>{item.name}</Text>
                        {balanceText ? (
                            <Text variant="footnote" color={balanceColor} style={styles.balanceText}>
                                {balanceText}
                            </Text>
                        ) : null}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
                </TouchableOpacity>
            </Link>
        </Card>
    );
};


export default function GroupsScreen() {
    const router = useRouter();
    const headerHeight = useHeaderHeight(); // Get the actual header height

    // --- State and Data ---
    const [groups, setGroups] = useState<Group[] | null>(null);
    const [allExpenses, setAllExpenses] = useState<Expense[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();
    const currentUser = user || MOCK_USER;

    // --- useEffect for Data Loading ---
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            const currentExpenses = generateMockExpenses();
            const currentGroups = [
                { id: '1', name: 'March Vacation', expenses: currentExpenses.filter(e => e.groupId === '1') },
                { id: '2', name: 'Roommates', expenses: currentExpenses.filter(e => e.groupId === '2') },
                { id: '3', name: 'Project Phoenix', expenses: [] },
            ];
            setAllExpenses(currentExpenses);
            setGroups(currentGroups);
            setIsLoading(false);
        }, 50);
        return () => clearTimeout(timer);
    }, []);


    // --- Chart Data Calculation (Keep as before) ---
    const { chartData, highlightIndex } = useMemo(() => {
        if (!allExpenses) {
            const defaultLabels = [];
            const todayForLabels = new Date();
            for (let i = 6; i >= 0; i--) {
                const date = new Date(todayForLabels);
                date.setDate(todayForLabels.getDate() - i);
                defaultLabels.push(formatShortDateLabel(date));
            }
            const emptyData = defaultLabels.map(label => ({ date: label, total: 0 }));
            while (emptyData.length < 2) { emptyData.push({ date: '', total: 0 }); }
            return { chartData: emptyData, highlightIndex: -1 };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const totalsByDate: { [key: string]: { total: number; shortLabel: string } } = {};
        let maxSpending = -1;
        let maxIndex = -1;
        const dateKeysSorted: string[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateKey = formatDateKey(date);
            const shortLabel = formatShortDateLabel(date);
            if (!totalsByDate[dateKey]) {
                totalsByDate[dateKey] = { total: 0, shortLabel: shortLabel };
                dateKeysSorted.push(dateKey);
            }
        }

        (allExpenses || []).forEach(expense => {
            try {
                const expenseDate = new Date(expense.date);
                if (isNaN(expenseDate.getTime())) return;
                expenseDate.setHours(0, 0, 0, 0);
                const dateKey = formatDateKey(expenseDate);
                if (totalsByDate[dateKey]) {
                    totalsByDate[dateKey].total += expense.amount;
                }
            } catch (e) { console.error("Error processing expense date:", expense, e); }
        });

        let currentHighlightIndex = -1;
        const formattedChartData = dateKeysSorted.map((dateKey, index) => {
            const dayData = totalsByDate[dateKey] || { total: 0, shortLabel: '??' };
            const label = dayData.shortLabel;
            const total = dayData.total;
            if (total > maxSpending) {
                maxSpending = total;
                currentHighlightIndex = index;
            }
            return { date: label, total: total };
        });

        if (formattedChartData.length < 2) {
            const dummyLabels = dateKeysSorted.map(key => totalsByDate[key]?.shortLabel ?? '');
            const dummyPoints = dummyLabels.map(l => ({ date: l, total: 0 }));
            while (dummyPoints.length < 2) { dummyPoints.push({ date: '', total: 0 }); }
            return { chartData: dummyPoints, highlightIndex: -1 };
        }

        return { chartData: formattedChartData, highlightIndex: currentHighlightIndex };
    }, [allExpenses]);

    const handleAddGroup = () => {
        router.push('/(app)/create-group');
    };

    const renderGroupItem = ({ item }: { item: Group }) => {
        const groupExpenses = (allExpenses || []).filter(exp => exp.groupId === item.id);
        const balanceInfo = calculateMyGroupBalance(groupExpenses, currentUser?.id);
        return (
            <GroupListItem
                item={item}
                balanceText={balanceInfo.text}
                balanceColor={balanceInfo.color}
            />
        );
    };

    // --- Render Functions for List ---
    const renderListHeader = () => (
        <View style={styles.listHeaderContainer}>
            {/* Keep titles within the FlatList header */}
            <Text variant="sectionHeader" style={styles.sectionTitle}>Spending (Last 7 Days)</Text>
            <GroupSpendingChart
                data={chartData}
                isLoading={isLoading || !allExpenses}
                highlightIndex={highlightIndex}
            />
            <Text variant="sectionHeader" style={styles.sectionTitle}>Your Groups</Text>
        </View>
    );

    const renderEmptyList = () => (
        <View style={styles.centeredEmptyList}>
            <Text variant="body" color={COLORS.textSecondary} center>
                No groups yet. Tap 'Add Group' to create one.
            </Text>
        </View>
    );

    return (
        // Use SafeAreaView to handle notches/status bars for the top edge
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <Stack.Screen
                options={{
                    title: 'bolm',
                    headerLargeTitle: true,
                    headerLargeTitleStyle: { ...TYPOGRAPHY.largeTitle, color: COLORS.textPrimary },
                    // Ensure header bg matches safe area bg
                    headerStyle: { backgroundColor: COLORS.background },
                    headerShadowVisible: false,
                    headerRight: () => (
                        <Button
                            title="Add Group"
                            onPress={handleAddGroup}
                            variant="primary" // Use primary for blue text button
                            style={styles.headerButton}
                        />
                    ),
                    headerBackTitleVisible: false,
                    // Large title should handle safe area, but SafeAreaView wrapper adds safety
                }}
            />

            {/* Conditional rendering for loading/empty/list */}
            {isLoading ? (
                <View style={styles.centeredLoading}>
                    <ActivityIndicator size="large" color={COLORS.textSecondary} />
                </View>
            ) : (
                <FlatList
                    data={groups}
                    keyExtractor={(item) => item.id}
                    renderItem={renderGroupItem}
                    style={styles.list} // List takes remaining space
                    contentContainerStyle={{
                        // Keep padding to push list content below header
                        paddingTop: headerHeight,
                        paddingBottom: 30,
                        paddingHorizontal: 16, // Horizontal padding for list items/header
                        flexGrow: 1, // Needed for ListEmptyComponent
                    }}
                    // Let FlatList handle safe area for indicator automatically
                    automaticallyAdjustsScrollIndicatorInsets={true}
                    ListHeaderComponent={renderListHeader}
                    ListEmptyComponent={renderEmptyList}
                    extraData={currentUser?.id}
                />
            )}
        </SafeAreaView>
    );
}

// --- Styles ---
const styles = StyleSheet.create({
    // Use SafeAreaView for the main container
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background, // Set the screen background color here
    },
    centeredLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // Background is inherited from safeArea
    },
    centeredEmptyList: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        minHeight: 200,
    },
    headerButton: {
        marginRight: Platform.OS === 'ios' ? 16 : 10,
    },
    list: {
        flex: 1, // Ensure list takes up space within contentArea
        // Background is now on safeArea
    },
    listHeaderContainer: {
        paddingBottom: 10,
        // No top padding needed here, handled by FlatList's contentContainerStyle
    },
    sectionTitle: {
        marginTop: 24,
        marginBottom: 8,
        color: COLORS.textSecondary,
    },
    groupItemCard: {
        backgroundColor: COLORS.card,
        borderRadius: 10,
        marginBottom: 12,
        marginHorizontal: 0, // Takes full width within list padding
    },
    groupItemTouchable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    groupInfoContainer: {
        flex: 1,
        marginRight: 8,
    },
    groupNameText: {
        fontWeight: '500',
        color: COLORS.textPrimary,
    },
    balanceText: {
        marginTop: 4,
    },
});
