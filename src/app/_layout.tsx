// src/app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import {COLORS} from "../constants/colors";

export default function RootLayout() {
    // For development, set a mock user to skip auth
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        // Comment this out when you want to test the auth flow
        setUser({ id: 'user1', email: 'user1@example.com', name: 'Alex Chen' });
    }, []);

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.backgroundPrimary }
            }}
        />
    );
}