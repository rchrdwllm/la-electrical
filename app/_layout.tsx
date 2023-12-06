import { Stack } from 'expo-router';
import { AuthProvider } from '../context/Auth';
import SplashScreen from '../components/SplashScreen';
import Reanimated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { StyleSheet, LogBox } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Colors } from '../types';

LogBox.ignoreAllLogs();

const Layout = () => {
    const [appIsReady, setAppIsReady] = useState(false);
    const { palette } = useTheme();
    const styles = styling(palette);

    useEffect(() => {
        setTimeout(() => {
            setAppIsReady(true);
        });
    }, []);

    if (!appIsReady) return <SplashScreen />;

    return (
        <Reanimated.View entering={FadeIn.delay(250)} exiting={FadeOut} style={styles.container}>
            <AuthProvider>
                <Stack
                    initialRouteName="sign-in"
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen
                        name="sign-in"
                        options={{
                            animation: 'fade',
                        }}
                    />
                </Stack>
            </AuthProvider>
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
