// src/app/(app)/create-group.tsx
// (Updated version from step 4 is already quite minimalist, ensure styles match)
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { COLORS } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { useGroupsStore } from '../../store/groupsStore'; // Assuming you have this
// import { useAuthStore } from '../../store/authStore'; // Assuming you have this

export default function CreateGroupScreen() {
    const [groupName, setGroupName] = useState('');
    const router = useRouter();
    // const { createGroup, isLoading, error } = useGroupsStore(); // Example store usage
    // const { user } = useAuthStore(); // Example store usage
    const isLoading = false; // Placeholder
    const error = null; // Placeholder
    const user = { id: '123' }; // Placeholder

    const handleCreateGroup = async () => {
        if (!user || !groupName.trim()) {
            Alert.alert('Error', 'Please enter a group name.');
            return;
        }
        console.log('Creating group:', groupName);
        // addGroup({ id: Date.now().toString(), name: groupName, expenses: [] }); // Example store usage
        router.back(); // Go back to the previous screen
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
            <Stack.Screen
                options={{
                    title: 'Create New Group',
                    presentation: 'modal',
                    headerStyle: { backgroundColor: COLORS.background },
                    headerTitleStyle: { color: COLORS.textPrimary },
                    headerTintColor: COLORS.primaryAccent, // Use accent for back/cancel if desired
                    headerLeft: () => (
                        <Button title="Cancel" onPress={handleCancel} variant="secondary" /> // Use secondary/text variant
                    ),
                    headerRight: () => (
                        <Button
                            title="Create"
                            onPress={handleCreateGroup}
                            variant="primary" // Primary action
                            disabled={!groupName.trim() || isLoading}
                            isLoading={isLoading}
                            textStyle={styles.createButtonText} // Make Create bold
                        />
                    ),
                    headerShadowVisible: false,
                }}
            />
            <View style={styles.container}>
                <Input
                    label="Group Name" // Keep label for clarity
                    placeholder="e.g., Roommates, Trip to Paris, etc."
                    value={groupName}
                    onChangeText={setGroupName}
                    autoCapitalize="words"
                    returnKeyType="done"
                    onSubmitEditing={handleCreateGroup}
                    autoFocus={true} // Focus input on screen load
                    containerStyle={styles.inputContainer}
                />
                {error && (
                    <Text variant="footnote" color={COLORS.error} style={styles.errorText}>
                        {error}
                    </Text>
                )}
            </View>
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
        padding: 20,
        paddingTop: 30, // Add some top padding below header
    },
    inputContainer: {
        marginBottom: 30, // More space after input
    },
    errorText: {
        marginTop: 8,
        textAlign: 'center',
    },
    createButtonText: {
        fontWeight: 'bold', // Make Create button text bold
    },
});
