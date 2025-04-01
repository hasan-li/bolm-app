// src/app/(app)/add-expense.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { COLORS } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
// Import stores if needed
// import { useGroupsStore } from '../../store/groupsStore';
// import { useExpensesStore } from '../../store/expensesStore';
// import { useAuthStore } from '../../store/authStore';

export default function AddExpenseScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ groupId?: string; groupName?: string }>();
    const { groupId, groupName } = params; // Get groupName passed from previous screen

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    // const { addExpense, isLoading, error: expenseError } = useExpensesStore();
    // const { user } = useAuthStore();
    const isLoading = false; // Placeholder
    const expenseError = null; // Placeholder
    const user = { id: 'user1' }; // Placeholder

    const handleAdd = async () => {
        if (!user || !groupId) {
            Alert.alert('Error', 'User or Group ID missing.');
            return;
        }
        const numericAmount = parseFloat(amount);
        if (!description.trim() || isNaN(numericAmount) || numericAmount <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid description and amount.');
            return;
        }

        console.log('Adding expense:', { description, amount: numericAmount, groupId });
        // Replace with actual store logic
        // const success = await addExpense({ ... });
        // if (success) {
        //   router.back();
        // } else {
        //   const storeError = useExpensesStore.getState().error;
        //   Alert.alert('Error', storeError || 'Failed to add expense.');
        // }
        router.back(); // Simulate success
    };

    const handleCancel = () => {
        router.back();
    };

    const displayGroupName = groupName || 'the group';

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
            <Stack.Screen
                options={{
                    title: '', // Empty title, let the content define it
                    presentation: 'modal',
                    headerStyle: { backgroundColor: COLORS.background },
                    headerShadowVisible: false, // No shadow
                    headerLeft: () => (
                        <Button title="Cancel" onPress={handleCancel} variant="secondary" />
                    ),
                    headerRight: () => (
                        <Button
                            title="Add"
                            onPress={handleAdd}
                            variant="primary"
                            disabled={!description.trim() || !amount || isLoading}
                            isLoading={isLoading}
                            textStyle={styles.addButtonText}
                        />
                    ),
                }}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust offset if needed
            >
                <View style={styles.content}>
                    <Text variant="title3" style={styles.infoTitle}>
                        Add Expense to {displayGroupName}
                    </Text>

                    {expenseError && (
                        <Text variant="footnote" color={COLORS.error} style={styles.errorText}>
                            {expenseError}
                        </Text>
                    )}

                    <Input
                        label="DESCRIPTION" // Uppercase label
                        placeholder="e.g., Dinner, Groceries, etc."
                        value={description}
                        onChangeText={setDescription}
                        autoFocus={true}
                        returnKeyType="next"
                        // Add onSubmitEditing to focus next field if needed
                    />

                    <Input
                        label="AMOUNT" // Uppercase label
                        placeholder="0.00"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad" // Use decimal pad for currency
                        returnKeyType="done"
                        onSubmitEditing={handleAdd}
                    />

                    <Text variant="footnote" color={COLORS.textSecondary} style={styles.splitInfo}>
                        This expense will be split equally among all group members by default.
                    </Text>
                </View>
                {/* Buttons are in the header */}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 10, // Reduced top padding as title is in content now
    },
    infoTitle: {
        marginBottom: 30, // More space after title
        color: COLORS.textPrimary,
    },
    errorText: {
        marginBottom: 16,
        textAlign: 'center',
    },
    splitInfo: {
        marginTop: 20, // More space above the info text
        textAlign: 'center',
    },
    addButtonText: {
        fontWeight: 'bold',
    },
});
