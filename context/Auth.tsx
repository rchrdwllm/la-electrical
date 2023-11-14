import { User } from 'firebase/auth';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../types';
import { useTheme } from '../hooks/useTheme';

export const AuthContext = createContext<[User | null, Dispatch<SetStateAction<User | null>>]>([
    null,
    () => {},
]);

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null);
    const { palette } = useTheme();
    const styles = styling(palette);

    return (
        <AuthContext.Provider value={[user, setUser]}>
            <View style={styles.rootContainer}>{children}</View>
        </AuthContext.Provider>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        rootContainer: {
            flex: 1,
            backgroundColor: palette.primaryBackground,
        },
    });
