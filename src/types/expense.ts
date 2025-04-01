export interface Expense {
    id: string;
    description: string;
    amount: number;
    paidByUserId: string;
    paidByName: string;
    date: string;
    groupId: string;
}

export interface Balance {
    userId: string;
    userName: string;
    amount: number; // Positive = they owe you, Negative = you owe them
}