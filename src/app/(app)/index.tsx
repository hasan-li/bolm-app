// src/app/(app)/index.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { GroupSpendingChart } from '../../components/charts/GroupSpendingChart';
import { useGroupsStore } from '../../store/groupsStore';
import { useExpensesStore } from '../../store/expensesStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Group } from '../../types/group';
import { Expense } from '../../types/expense';
import { Ionicons } from '@expo/vector-icons';

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

const formatShortDateLabel = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
};

// --- Generate Dynamic Mock Data ---
const generateMockExpenses = (): Expense[] => {
    return [
        { id: 'e1', description: 'Flights', amount: 350.00, date: getDateDaysAgo(6).toISOString(), paidByUserId: 'user1', paidByName: 'You', groupId: '1' },
        { id: 'e3', description: 'Hotel', amount: 420.50, date: getDateDaysAgo(5).toISOString(), paidByUserId: 'user2', paidByName: 'Taylor Kim', groupId: '1' },
        { id: 'e6', description: 'Museum Tickets', amount: 45.00, date: getDateDaysAgo(4).toISOString(), paidByUserId: 'user1', paidByName: 'You', groupId: '1' },
        { id: 'e2', description: 'Groceries', amount: 85.75, date: getDateDaysAgo(3).toISOString(), paidByUserId: 'user2', paidByName: 'Taylor Kim', groupId: '2' },
        { id: 'e4', description: 'Internet Bill', amount: 60.00, date: getDateDaysAgo(2).toISOString(), paidByUserId: 'user1', paidByName: 'You', groupId: '2' },
        { id: 'e5', description: 'Takeout Pizza', amount: 32.00, date: getDateDaysAgo(1).toISOString(), paidByUserId: 'user2', paidByName: 'Taylor Kim', groupId: '2' },
        { id: 'e7', description: 'Movie Night', amount: 25.00, date: getDateDaysAgo(0).toISOString(), paidByUserId: 'user1', paidByName: 'You', groupId: '2' },
        { id: 'e8', description: 'Old Coffee', amount: 5.00, date: getDateDaysAgo(8).toISOString(), paidByUserId: 'user1', paidByName: 'You', groupId: '2' },
    ];
};

// Define initial data outside the component
const initialGroups: Group[] = [
    { id: '1', name: 'March Vacation', expenses: generateMockExpenses().filter(e => e.groupId === '1') },
    { id: '2', name: 'Roommates', expenses: generateMockExpenses().filter(e => e.groupId === '2') },
    { id: '3', name: 'Project Phoenix', expenses: [] },
];
const initialExpenses: Expense[] = generateMockExpenses();
const MOCK_USER = { id: 'user1' };

// --- Balance Calculation Helper (Keep as before) ---
const calculateMyGroupBalance = (
    groupExpenses: Expense[] | undefined,
    myUserId: string | undefined
): { text: string; color: string } => {
    // ... (implementation from previous step) ...
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

// --- Group List Item Component (Keep as before) ---
interface GroupListItemProps {
    item: Group;
    balanceText: string;
    balanceColor: string;
}
const GroupListItem: React.FC<GroupListItemProps> = ({ item, balanceText, balanceColor }) => {
    // ... (implementation from previous step) ...
    return (
        <Link href={`/(app)/group/${item.id}`} asChild>
            <TouchableOpacity style={styles.groupItem} activeOpacity={0.7}>
                <View style={styles.groupInfoContainer}>
                    <Text variant="headline" style={styles.groupNameText}>{item.name}</Text>
                    {balanceText ? (
                        <Text variant="footnote" color={balanceColor} style={styles.balanceText}>
                            {balanceText}
                        </Text>
                    ) : null}
                </View>
                <Ionicons name="chevron-forward-outline" size={20} color={COLORS.textTertiary} />
            </TouchableOpacity>
        </Link>
    );
};


export default function GroupsScreen() {
    const router = useRouter();
    const headerHeight = useHeaderHeight();

    // --- State and Data ---
    const [groups, setGroups] = useState<Group[]>(initialGroups); // Use initial constant
    const [allExpenses, setAllExpenses] = useState<Expense[]>(initialExpenses); // Use initial constant
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthStore();
    const currentUser = user || MOCK_USER;

    // --- Chart Data Calculation (with safeguards) ---
    const { chartData, highlightIndex, dateRangeLabel } = useMemo(() => {
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
            totalsByDate[dateKey] = { total: 0, shortLabel: shortLabel };
            dateKeysSorted.push(dateKey);
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
            } catch (e) {
                console.error("Error processing expense date:", expense, e);
            }
        });

        const formattedChartData = dateKeysSorted.map((dateKey, index) => {
            const dayData = totalsByDate[dateKey];
            const label = dayData?.shortLabel ?? ''; // Safeguard
            const total = dayData?.total ?? 0;      // Safeguard

            if (total > maxSpending) {
                maxSpending = total;
                maxIndex = index;
            }
            return { date: label, total: total };
        });

        const startDateLabel = totalsByDate[dateKeysSorted[0]]?.shortLabel;
        const endDateLabel = totalsByDate[dateKeysSorted[dateKeysSorted.length - 1]]?.shortLabel;
        const rangeLabel = startDateLabel && endDateLabel ? `${startDateLabel} - ${endDateLabel}` : '';

        if (formattedChartData.length === 1) {
            return { chartData: [formattedChartData[0], { ...formattedChartData[0], date: '' }], highlightIndex: 0, dateRangeLabel: rangeLabel };
        }

        return { chartData: formattedChartData, highlightIndex: maxIndex, dateRangeLabel: rangeLabel };
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

    return (
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
            <Stack.Screen
                options={{
                    title: 'bolm',
                    headerLargeTitle: true,
                    headerLargeTitleStyle: { color: COLORS.textPrimary, fontWeight: 'bold' },
                    headerStyle: { backgroundColor: COLORS.background },
                    headerShadowVisible: false,
                    headerRight: () => (
                        <Button
                            title="Add Group"
                            onPress={handleAddGroup}
                            variant="primary"
                            style={styles.headerButton}
                        />
                    ),
                    headerBackTitleVisible: false,
                }}
            />

            <FlatList
                data={groups} // Use the state variable
                keyExtractor={(item) => item.id}
                renderItem={renderGroupItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={styles.list}
                contentContainerStyle={{
                    paddingTop: headerHeight, // Keep this for large title spacing
                    paddingBottom: 20,
                    flexGrow: 1 // Important for ListEmptyComponent
                }}
                scrollIndicatorInsets={{ top: headerHeight }}
                ListHeaderComponent={
                    <View style={styles.headerContent}>
                        <Text variant="title3Uppercase" style={styles.sectionTitle}>Spending (Last 7 Days)</Text>
                        <GroupSpendingChart
                            data={chartData}
                            isLoading={isLoading}
                            highlightIndex={highlightIndex}
                            yAxisLabelText="SPENDING"
                            xAxisLabelText="DAY"
                            xRangeLabelText={dateRangeLabel}
                        />
                        <Text variant="title3Uppercase" style={styles.sectionTitle}>Your Groups</Text>
                    </View>
                }
                ListEmptyComponent={ // Shows only when data={groups} is empty or null/undefined
                    <View style={styles.centered}>
                        {isLoading ? (
                            <ActivityIndicator size="large" color={COLORS.textSecondary} />
                        ) : (
                            <Text variant="body" color={COLORS.textSecondary} center>
                                No groups yet. Tap 'Add Group' to create one.
                            </Text>
                        )}
                    </View>
                }
                // extraData={groups.length} // Force update if list length changes
            />
        </SafeAreaView>
    );
}

// --- Styles (Keep the previous styles) ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centered: {
        flexGrow: 1, // Important: Allows empty component to fill space
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        // Remove minHeight if flexGrow is used
        backgroundColor: COLORS.background,
    },
    headerButton: {
        marginRight: Platform.OS === 'ios' ? 16 : 10,
    },
    list: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    listContentContainer: {
        flexGrow: 1, // Needed for ListEmptyComponent to work correctly when list can be empty
        paddingBottom: 20,
        // paddingTop: headerHeight, // This should be handled by the Stack Navigator now
    },
    headerContent: {
        // Container for elements above the list items
    },
    sectionTitle: {
        marginTop: 20,
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    groupItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: COLORS.transparent,
    },
    groupInfoContainer: {
        flex: 1,
        marginRight: 8,
    },
    groupNameText: {},
    balanceText: {
        marginTop: 2,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: COLORS.border,
        marginHorizontal: 16,
    },
});
