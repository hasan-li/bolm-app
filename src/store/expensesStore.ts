import { create } from 'zustand';
import { mockApi } from '../api/mockApi';
import { Expense, Balance } from '../types/expense';

interface ExpensesState {
    expenses: Expense[];
    balances: Balance[];
    isLoading: boolean;
    error: string | null;

    fetchExpenses: (groupId: string) => Promise<void>;
    addExpense: (groupId: string, description: string, amount: number, paidByUserId: string) => Promise<void>;
    calculateBalances: (groupId: string, currentUserId: string) => void;
}

export const useExpensesStore = create<ExpensesState>((set, get) => ({
    expenses: [],
    balances: [],
    isLoading: false,
    error: null,

    fetchExpenses: async (groupId) => {
        set({ isLoading: true, error: null });
        try {
            const expenses = await mockApi.getGroupExpenses(groupId);
            set({ expenses, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch expenses',
                isLoading: false
            });
        }
    },

    addExpense: async (groupId, description, amount, paidByUserId) => {
        set({ isLoading: true, error: null });
        try {
            const newExpense = await mockApi.createExpense(
                groupId,
                description,
                amount,
                paidByUserId
            );
            set(state => ({
                expenses: [...state.expenses, newExpense],
                isLoading: false
            }));
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to add expense',
                isLoading: false
            });
        }
    },

    calculateBalances: (groupId, currentUserId) => {
        const { expenses } = get();
        const groupExpenses = expenses.filter(e => e.groupId === groupId);

        // Get the current group from the groups store to get member details
        // This is a simple implementation; in a real app, you might want to use a more robust approach
        const useGroupsStore = require('./groupsStore').useGroupsStore;
        const currentGroup = useGroupsStore.getState().currentGroup;

        if (!currentGroup) return;

        const members = currentGroup.members;
        const balanceMap: Record<string, number> = {};

        // Initialize balances for all members
        members.forEach(member => {
            balanceMap[member.id] = 0;
        });

        // Calculate expenses
        groupExpenses.forEach(expense => {
            const { amount, paidByUserId } = expense;
            const splitAmount = amount / members.length;

            // The payer paid for everyone
            balanceMap[paidByUserId] += amount - splitAmount;

            // Everyone owes their share to the payer
            members.forEach(member => {
                if (member.id !== paidByUserId) {
                    balanceMap[member.id] -= splitAmount;
                }
            });
        });

        // Convert to array format relative to the current user
        const balances: Balance[] = [];

        members.forEach(member => {
            if (member.id !== currentUserId) {
                balances.push({
                    userId: member.id,
                    userName: member.name,
                    // Positive = they owe me, Negative = I owe them
                    amount: balanceMap[currentUserId] - balanceMap[member.id]
                });
            }
        });

        set({ balances });
    }
}));