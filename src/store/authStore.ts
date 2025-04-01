// src/store/authStore.ts
import { create } from 'zustand';
import { mockApi } from '../api/mockApi';
import { Session, User } from '../types/auth';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => void;

    // For convenience in development
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { user, session } = await mockApi.login(email, password);
            set({ user, session, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Login failed',
                isLoading: false
            });
        }
    },

    signup: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { user, session } = await mockApi.signup(email, password);
            set({ user, session, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Signup failed',
                isLoading: false
            });
        }
    },

    logout: () => {
        set({ user: null, session: null });
    },

    setUser: (user) => {
        set({
            user,
            session: { user, token: 'mock-token' }
        });
    },
}));
