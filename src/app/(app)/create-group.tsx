// src/app/(app)/create-group.tsx
import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGroupsStore } from '../../store/groupsStore';
import { useAuthStore } from '../../store/authStore';

export default function CreateGroupScreen() {
    const [groupName, setGroupName] = useState('');
    const router = useRouter();

    // Replace with actual store hooks and state
    // const { createGroup, isLoading, error } = useGroupsStore();
    // const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false); // Example loading state
    const [error, setError] = useState<string | null>(null); // Example error state
    const user = { id: 'mockUserId' }; // Example user

    const handleCreateGroup = async () => {
        if (!user || !groupName.trim()) {
            setError('Please enter a group name.');
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            console.log('Simulating group creation:', groupName);
            // const success = await createGroup(groupName, user.id);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const success = true;

            if (success) {
                router.back();
            } else {
                const storeError = 'Failed to create group. Please try again.';
                setError(storeError);
                Alert.alert('Error', storeError);
            }
        } catch (e) {
            console.error(e);
            const errorMsg = 'An unexpected error occurred.';
            setError(errorMsg);
            Alert.alert('Error', errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (!isLoading) {
            router.back();
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
            <Stack.Screen
                options={{
                    title: 'Create Group',
                    presentation: 'modal',
                    headerStyle: { backgroundColor: COLORS.background },
                    headerTitleStyle: {
                        ...TYPOGRAPHY.headline,
                        color: COLORS.textPrimary,
                    },
                    headerTintColor: COLORS.primaryAccent,
                    headerLeft: () => (
                        <Button
                            title="Cancel"
                            onPress={handleCancel}
                            variant="secondary" // Blue text, regular weight
                            disabled={isLoading}
                        />
                    ),
                    headerRight: () => (
                        <Button
                            title="Create"
                            onPress={handleCreateGroup}
                            variant="primary" // Blue text, semibold weight
                            disabled={!groupName.trim() || isLoading}
                            isLoading={isLoading} // Show spinner inside button
                            textStyle={isLoading ? styles.hiddenText : null}
                        />
                    ),
                    headerShadowVisible: false,
                }}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.container}>
                    <Input
                        label="Group Name"
                        placeholder="e.g., Weekend Trip, Office Lunch"
                        value={groupName}
                        onChangeText={(text) => {
                            setGroupName(text);
                            if (error) setError(null);
                        }}
                        autoCapitalize="words"
                        returnKeyType="done"
                        onSubmitEditing={handleCreateGroup}
                        autoFocus={true}
                        error={error ?? undefined}
                        containerStyle={styles.inputContainer}
                        editable={!isLoading}
                    />
                    {/* Error text is now handled by the Input component */}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 30, // More space below header
    },
    inputContainer: {
        marginBottom: 30,
    },
    hiddenText: { // Style to hide button text when loading indicator is shown
        color: 'transparent',
    },
});
