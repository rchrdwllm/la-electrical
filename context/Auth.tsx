import { PropsWithChildren, createContext } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import { User, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseAuth } from '../config/firebase';
import { router } from 'expo-router';

export const AuthContext = createContext<{
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    session: User | null;
    isLoading: boolean;
} | null>(null);

export const SessionProvider = (props: PropsWithChildren) => {
    const [[isLoading, session], setSession] = useStorageState('session');

    return (
        <AuthContext.Provider
            value={{
                signIn: async (email, password) => {
                    try {
                        const res = await signInWithEmailAndPassword(firebaseAuth, email, password);

                        alert(JSON.stringify(res.user));
                        setSession(res.user);
                        router.replace('/');
                    } catch (error: any) {
                        console.log(error);

                        alert('Sign in failed: ' + error.message);
                    }
                },
                signOut: async () => {
                    await signOut(firebaseAuth);
                },
                session,
                isLoading,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};
