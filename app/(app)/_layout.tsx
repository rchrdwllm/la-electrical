import { Redirect, Stack } from 'expo-router';
import Reanimated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Colors } from '../../types';
import { StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebase';
import { useTheme } from '../../hooks/useTheme';

const Layout = () => {
    const [user, setUser] = useAuth();
    const { palette } = useTheme();
    const styles = styling(palette);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, user => {
            setUser(user);
        });
    }, []);

    if (!user) return <Redirect href="/sign-in" />;

    return (
        <Reanimated.View entering={FadeIn.delay(250)} exiting={FadeOut} style={styles.container}>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="index" />
            </Stack>
        </Reanimated.View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: palette.primaryBackground,
        },
    });

export default Layout;
