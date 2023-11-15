import { Stack } from 'expo-router';
import { AuthProvider } from '../context/Auth';
import SplashScreen from '../components/SplashScreen';
import { StatusBar } from 'expo-status-bar';
import Reanimated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useCallback, useEffect, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Colors } from '../types';
import { StyleSheet } from 'react-native';

const Layout = () => {
    const [appIsReady, setAppIsReady] = useState(false);
    const { palette } = useTheme();
    const styles = styling(palette);

    const prepare = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
            console.warn(e);
        } finally {
            setAppIsReady(true);
        }
    };

    useEffect(() => {
        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
        }
    }, [appIsReady]);

    if (!appIsReady) return <SplashScreen />;

    return (
        <Reanimated.View
            entering={FadeIn.delay(250)}
            exiting={FadeOut}
            onLayout={onLayoutRootView}
            style={styles.container}
        >
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
            <StatusBar animated style="light" />
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
