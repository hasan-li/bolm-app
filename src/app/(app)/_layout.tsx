// src/app/(app)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export default function AppLayout() {
    // Auth logic should be moved to the root layout (src/app/_layout.tsx)
    // or handled via a context provider higher up.
    // This layout assumes the user is authenticated and focuses on the app's stack.

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.background, // Use grey background for header
                },
                headerTintColor: COLORS.textPrimary, // Dark text for title and back button
                headerTitleStyle: {
                    // Use a suitable typography style for titles
                    fontSize: TYPOGRAPHY.headline.fontSize,
                    fontWeight: TYPOGRAPHY.headline.fontWeight,
                    color: COLORS.textPrimary,
                },
                headerShadowVisible: false, // Key for the flat, modern look
                headerBackTitleVisible: false, // Cleaner look without "Back" text
                // You can add more default options here
            }}
        >
            {/* Define screen-specific options directly in each screen file */}
            {/* using <Stack.Screen options={{...}} /> */}
            {/* Example structure (no need to list them if using file-based routing options): */}
            {/* <Stack.Screen name="index" options={{ title: 'Groups' }} /> */}
            {/* <Stack.Screen name="create-group" options={{ title: 'Create Group', presentation: 'modal' }} /> */}
            {/* <Stack.Screen name="group/[id]" /> */}
            {/* <Stack.Screen name="add-expense" options={{ title: 'Add Expense', presentation: 'modal' }} /> */}
        </Stack>
    );
}

// No need for the StyleSheet here anymore as Stack handles the container
