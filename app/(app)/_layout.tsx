import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebase';

const Layout = () => {
    const [user, setUser] = useAuth();

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, user => {
            setUser(user);
        });
    }, []);

    if (!user) return <Redirect href="/sign-in" />;

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
        </Stack>
    );
};

export default Layout;
