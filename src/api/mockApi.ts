// src/api/mockApi.ts
import { Group, GroupDetail } from '../types/group';
import { Expense } from '../types/expense';
import { Session, User } from '../types/auth';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users
const USERS: User[] = [
    { id: 'user1', email: 'user1@example.com', name: 'Alex Chen' },
    { id: 'user2', email: 'user2@example.com', name: 'Taylor Kim' },
    { id: 'user3', email: 'user3@example.com', name: 'Jordan Smith' },
];

// Mock groups
const GROUPS: Group[] = [
    { id: 'group1', name: 'March Vacation' },
    { id: 'group2', name: 'Roommates' },
];

// Mock group details with members
const GROUP_DETAILS: Record<string, GroupDetail> = {
    'group1': {
        id: 'group1',
        name: 'March Vacation',
        members: [USERS[0], USERS[1]],
    },
    'group2': {
        id: 'group2',
        name: 'Roommates',
        members: [USERS[0], USERS[1], USERS[2]],
    },
};

// Mock expenses
const EXPENSES: Expense[] = [
    {
        id: 'exp1',
        description: 'Groceries',
        amount: 75.50,
        paidByUserId: 'user1',
        paidByName: 'Alex Chen',
        date: new Date().toISOString(),
        groupId: 'group1',
    },
    {
        id: 'exp2',
        description: 'Dinner',
        amount: 120.00,
        paidByUserId: 'user2',
        paidByName: 'Taylor Kim',
        date: new Date().toISOString(),
        groupId: 'group1',
    },
    {
        id: 'exp3',
        description: 'Utilities',
        amount: 89.75,
        paidByUserId: 'user3',
        paidByName: 'Jordan Smith',
        date: new Date().toISOString(),
        groupId: 'group2',
    },
];

export const mockApi = {
    // Auth
    async login(email: string, password: string): Promise<{ user: User, session: Session }> {
        await delay(800);

        const user = USERS.find(u => u.email === email);
        if (!user || password !== 'password') {
            throw new Error('Invalid credentials');
        }

        const session = {
            user,
            token: 'mock-jwt-token',
        };

        return { user, session };
    },

    async signup(email: string, password: string): Promise<{ user: User, session: Session }> {
        await delay(1000);

        if (!email.includes('@') || password.length < 6) {
            throw new Error('Invalid email or password');
        }

        const newId = `user${USERS.length + 1}`;
        const newUser = {
            id: newId,
            email,
            name: email.split('@')[0],
        };

        USERS.push(newUser);

        const session = {
            user: newUser,
            token: 'mock-jwt-token',
        };

        return { user: newUser, session };
    },

    // Groups
    async getGroups(userId: string): Promise<Group[]> {
        await delay(600);
        return GROUPS;
    },

    async getGroupDetails(groupId: string): Promise<GroupDetail> {
        await delay(700);

        const groupDetail = GROUP_DETAILS[groupId];
        if (!groupDetail) {
            throw new Error('Group not found');
        }

        return groupDetail;
    },

    async getGroupExpenses(groupId: string): Promise<Expense[]> {
        await delay(500);

        return EXPENSES.filter(expense => expense.groupId === groupId);
    },

    async createGroup(groupName: string, userId: string): Promise<Group> {
        await delay(800);

        if (!groupName.trim()) {
            throw new Error('Group name is required');
        }

        const newId = `group${GROUPS.length + 1}`;
        const newGroup = {
            id: newId,
            name: groupName,
        };

        GROUPS.push(newGroup);

        // Also create group details with the creator as the initial member
        const creator = USERS.find(u => u.id === userId);
        if (creator) {
            GROUP_DETAILS[newId] = {
                ...newGroup,
                members: [creator],
            };
        }

        return newGroup;
    },

    async createExpense(
        groupId: string,
        description: string,
        amount: number,
        paidByUserId: string
    ): Promise<Expense> {
        await delay(800);

        if (!description.trim() || amount <= 0) {
            throw new Error('Invalid expense details');
        }

        const payer = USERS.find(u => u.id === paidByUserId);
        if (!payer) {
            throw new Error('Payer not found');
        }

        const newId = `exp${EXPENSES.length + 1}`;
        const newExpense = {
            id: newId,
            description,
            amount,
            paidByUserId,
            paidByName: payer.name,
            date: new Date().toISOString(),
            groupId,
        };

        EXPENSES.push(newExpense);

        return newExpense;
    },
};