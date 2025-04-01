// src/components/groups/GroupCard.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';
import { COLORS } from '../../constants/colors';
import { Group } from '../../types/group';

interface GroupCardProps {
    group: Group;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
    return (
        <TouchableOpacity
            onPress={() => router.push(`/(app)/group/${group.id}`)}
            activeOpacity={0.7}
        >
            <Card>
                <View style={styles.container}>
                    <Text variant="headingSmall">{group.name}</Text>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
