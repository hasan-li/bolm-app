// src/app/(app)/add-expense.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    TextInput, // Import TextInput for ref typing
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
// Import stores if needed
// import { useGroupsStore } from '../../store/groupsStore';
// import { useExpensesStore } from '../../store/expensesStore';
// import { useAuthStore } from '../../store/authStore';

export default function AddExpenseScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ groupId?: string; groupName?: string }>();
    const { groupId, groupName: passedGroupName } = params;

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [descriptionError, setDescriptionError] = useState<string | undefined>();
    const [amountError, setAmountError] = useState<string | undefined>();

    // Ref for focusing amount input
    const amountInputRef = useRef<TextInput>(null);

    // Fetch group name if not passed (optional, depends on your flow)
    // const { getGroupById } = useGroupsStore();
    const [localGroupName, setLocalGroupName] = useState(passedGroupName || '');

    // Replace with actual store hooks and state
    // const { addExpense, isLoading, error: apiError } = useExpensesStore();
    // const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const user = { id: 'mockUserId' }; // Example user

    // Example effect to fetch group name if not passed via params
    // useEffect(() => {
    //   if (!passedGroupName && groupId) {
    //     // In a real app, fetch from store:
    //     // const group = getGroupById(groupId);
    //     // if (group) setLocalGroupName(group.name);
    //     setLocalGroupName("Fetched Group Name"); // Placeholder for mock
    //   }
    // }, [groupId, passedGroupName]); // Removed getGroupById if not used

    const validateInput = (): boolean => {
        let isValid = true;
        setDescriptionError(undefined);
        setAmountError(undefined);
        setApiError(null); // Clear previous API errors on new attempt

        if (!description.trim()) {
            setDescriptionError('Description cannot be empty.');
            isValid = false;
        }

        // Allow comma or dot as decimal separator, remove thousands separators if any
        const cleanedAmount = amount.replace(/,/g, '.').replace(/[^0-9.]/g, '');
        const numericAmount = parseFloat(cleanedAmount);

        if (isNaN(numericAmount) || numericAmount <= 0) {
            setAmountError('Please enter a valid positive amount.');
            isValid = false;
        }
        return isValid;
    }

    const handleAdd = async () => {
        if (!validateInput() || !user || !groupId) {
            return;
        }

        const cleanedAmount = amount.replace(/,/g, '.').replace(/[^0-9.]/g, '');
        const numericAmount = parseFloat(cleanedAmount);
        setIsLoading(true);
        setApiError(null);

        try {
            console.log('Simulating add expense:', { description, amount: numericAmount, groupId });
            // --- Replace with actual store logic ---
            // const success = await addExpense({
            //   groupId,
            //   description,
            //   amount: numericAmount,
            //   paidByUserId: user.id,
            //   // Add other necessary fields like date, participants etc.
            // });
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            const success = true; // Assume success for now
            // --- End of store logic replacement ---

            if (success) {
                router.back(); // Go back on success
            } else {
                // const storeError = useExpensesStore.getState().error; // Get error from store
                const storeError = 'Failed to add expense. Please try again.'; // Example error
                setApiError(storeError); // Set API error to display below fields
                // Alert.alert('Error', storeError); // Optional: Show alert as well
            }
        } catch (e) {
            console.error(e);
            const errorMsg = 'An unexpected error occurred.';
            setApiError(errorMsg);
            // Alert.alert('Error', errorMsg); // Optional: Show alert as well
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (!isLoading) { // Prevent cancelling while submitting
            router.back();
        }
    };

    const displayGroupName = localGroupName || 'this group'; // Fallback text

    return (
        // Use light background consistent with other screens
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
            <Stack.Screen
                options={{
                    title: 'Add Expense', // Keep title concise and standard
                    presentation: 'modal', // Standard modal presentation
                    headerStyle: { backgroundColor: COLORS.background }, // Match background
                    headerTitleStyle: {
                        ...TYPOGRAPHY.headline, // Use headline style for modal title
                        color: COLORS.textPrimary,
                    },
                    headerTintColor: COLORS.primaryAccent, // Color for back arrow/cancel
                    headerLeft: () => (
                        <Button
                            title="Cancel"
                            onPress={handleCancel}
                            variant="secondary" // Standard iOS cancel style (blue text)
                            disabled={isLoading}
                        />
                    ),
                    headerRight: () => (
                        <Button
                            title="Add"
                            onPress={handleAdd}
                            variant="primary" // Standard iOS done/add style (blue text, bold)
                            disabled={!description.trim() || !amount || isLoading}
                            isLoading={isLoading}
                            textStyle={isLoading ? styles.hiddenText : null} // Hide text when loading
                        />
                    ),
                    headerShadowVisible: false, // No shadow for flat design
                }}
            />
            {/* KeyboardAvoidingView helps push content up when keyboard appears */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust offset if header height changes
            >
                {/* Use a ScrollView if content might exceed screen height, otherwise View is fine */}
                <View style={styles.container}>
                    {/* Main content area */}
                    <View style={styles.formContainer}>
                        {/* Optional: Title within content if header title is empty */}
                        {/* <Text variant="title2" style={styles.infoTitle}>
              Add Expense to {displayGroupName}
            </Text> */}

                        {apiError && ( // Display general API errors above the form
                            <Text variant="footnote" color={COLORS.error} style={styles.apiErrorText}>
                                {apiError}
                            </Text>
                        )}

                        <Input
                            label="Description"
                            placeholder="What was this for?"
                            value={description}
                            onChangeText={(text) => {
                                setDescription(text);
                                setDescriptionError(undefined); // Clear error on change
                            }}
                            autoCapitalize="sentences"
                            returnKeyType="next"
                            onSubmitEditing={() => amountInputRef.current?.focus()} // Focus next input on submit
                            blurOnSubmit={false} // Keep keyboard open
                            error={descriptionError}
                            containerStyle={styles.inputContainer}
                            editable={!isLoading}
                            autoFocus={true} // Focus description field initially
                        />

                        <Input
                            ref={amountInputRef} // Assign ref
                            label="Amount"
                            placeholder="0.00"
                            value={amount}
                            onChangeText={(text) => {
                                // Basic filtering for currency input
                                const numericValue = text.replace(/[^0-9.,]/g, '');
                                setAmount(numericValue);
                                setAmountError(undefined); // Clear error on change
                            }}
                            keyboardType="decimal-pad" // Use appropriate keyboard
                            returnKeyType="done" // 'Done' action on keyboard
                            onSubmitEditing={handleAdd} // Trigger add on keyboard 'done'
                            error={amountError}
                            containerStyle={styles.inputContainer}
                            editable={!isLoading}
                        />
                    </View>

                    {/* Informational text at the bottom */}
                    <Text variant="caption1" color={COLORS.textSecondary} style={styles.splitInfo}>
                        This expense will be split equally among all group members by default.
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background, // Consistent background
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20, // Horizontal padding for the content
        paddingTop: Platform.OS === 'ios' ? 10 : 20, // Adjust top padding below header
        paddingBottom: 10, // Padding at the very bottom
        justifyContent: 'space-between', // Push splitInfo text towards bottom
    },
    formContainer: {
        // Holds the input fields
    },
    infoTitle: { // Style if title is moved into content
        marginBottom: 30,
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 24, // Spacing between inputs
    },
    apiErrorText: {
        marginBottom: 16,
        textAlign: 'center',
    },
    splitInfo: {
        textAlign: 'center',
        marginBottom: 10, // Space above bottom safe area/home indicator
    },
    hiddenText: { // Style to hide button text when loading indicator is shown
        color: 'transparent',
    },
});
