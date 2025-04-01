import { create } from 'zustand';
import { mockApi } from '../api/mockApi';
import { Group, GroupDetail } from '../types/group';

interface GroupsState {
    groups: Group[];
    currentGroup: GroupDetail | null;
    isLoading: boolean;
    error: string | null;

    fetchGroups: (userId: string) => Promise<void>;
    fetchGroupDetails: (groupId: string) => Promise<void>;
    createGroup: (name: string, userId: string) => Promise<void>;
}

export const useGroupsStore = create<GroupsState>((set, get) => ({
    groups: [],
    currentGroup: null,
    isLoading: false,
    error: null,

    fetchGroups: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const groups = await mockApi.getGroups(userId);
            set({ groups, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch groups',
                isLoading: false
            });
        }
    },

    fetchGroupDetails: async (groupId) => {
        set({ isLoading: true, error: null });
        try {
            const groupDetail = await mockApi.getGroupDetails(groupId);
            set({ currentGroup: groupDetail, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch group details',
                isLoading: false
            });
        }
    },

    createGroup: async (name, userId) => {
        set({ isLoading: true, error: null });
        try {
            const newGroup = await mockApi.createGroup(name, userId);
            set(state => ({
                groups: [...state.groups, newGroup],
                isLoading: false
            }));
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create group',
                isLoading: false
            });
        }
    },
}));
