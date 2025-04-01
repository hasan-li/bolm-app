import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Index() {
    const { user } = useAuthStore();

    // Redirect based on auth status
    return user ? <Redirect href="/(app)" /> : <Redirect href="/(auth)/login" />;
}