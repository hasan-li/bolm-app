// src/app/(auth)/signup.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../constants/colors';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, isLoading, error } = useAuthStore();

    const handleSignup = async () => {
        await signup(email, password);
        if (useAuthStore.getState().user) {
            router.replace('/(app)');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text variant="headingLarge" center style={styles.title}>
                    Join Bolm.app
                </Text>

                <Text variant="bodyLarge" center color={COLORS.textSecondary} style={styles.subtitle}>
                    Create an account to get started
                </Text>

                <Card style={styles.formCard}>
                    <Text variant="headingMedium" style={styles.formTitle}>
                        Sign up
                    </Text>

                    {error && (
                        <Text variant="bodySmall" color={COLORS.error} style={styles.errorText}>
                            {error}
                        </Text>
                    )}

                    <Input
                        label="Email"
                        placeholder="your.email@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        fullWidth
                    />

                    <Input
                        label="Password"
                        placeholder="Create a password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        fullWidth
                    />

                    <Button
                        title="Create Account"
                        onPress={handleSignup}
                        isLoading={isLoading}
                        fullWidth
                        style={styles.button}
                    />

                    <View style={styles.footer}>
                        <Text variant="bodyMedium" color={COLORS.textSecondary}>
                            Already have an account?
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text variant="bodyMedium" color={COLORS.accent} style={styles.link}>
                                Log in
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 16,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center',
    },
    title: {
        marginBottom: 8,
    },
    subtitle: {
        marginBottom: 32,
    },
    formCard: {
        width: '100%',
    },
    formTitle: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    link: {
        marginLeft: 4,
    },
    errorText: {
        marginBottom: 16,
    },
});