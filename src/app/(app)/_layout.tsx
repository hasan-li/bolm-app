// src/app/(app)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export default function AppLayout() {
    // Auth logic should ideally live in the root layout (src/app/_layout.tsx)
    // This layout defines the stack navigator for the authenticated part of the app.

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.background, // Use light grey background
                },
                headerTintColor: COLORS.primaryAccent, // Accent color for back arrow etc.
                headerTitleStyle: {
                    // Default title style (can be overridden per screen)
                    fontSize: TYPOGRAPHY.headline.fontSize,
                    fontWeight: TYPOGRAPHY.headline.fontWeight,
                    color: COLORS.textPrimary,
                },
                headerShadowVisible: false, // Clean, flat look
                headerBackButtonDisplayMode: "minimal", // Hide text next to back arrow on iOS
            }}
        >
            {/* Screens are defined by files in this directory */}
            {/* Specific options like headerLargeTitle are set in individual screen files */}
            <Stack.Screen name="index" options={{ headerShown: true }} />
            {/* Keep other screens default or customize in their files */}
            {/* <Stack.Screen name="create-group" /> */}
            {/* <Stack.Screen name="group/[id]" /> */}
            {/* <Stack.Screen name="add-expense" /> */}
        </Stack>
    );
}
