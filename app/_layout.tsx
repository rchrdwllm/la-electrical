import { Stack } from 'expo-router';
import { User, onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../config/firebase';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

const Layout = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, user => {
            console.log(user);

            setUser(user);

            if (user) {
                router.replace('/admin');
            }
        });
    }, []);

    useEffect(() => {
        if (user) {
            router.replace('/admin');
        }
    }, [user]);

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="sign-in" />
        </Stack>
    );
};

export default Layout;
