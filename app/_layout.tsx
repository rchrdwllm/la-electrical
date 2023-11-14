import { Stack } from 'expo-router';
import { AuthProvider } from '../context/Auth';
import SplashScreen from '../components/SplashScreen';
import Reanimated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useCallback, useEffect, useState } from 'react';

const Layout = () => {
    const [appIsReady, setAppIsReady] = useState(false);

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
            entering={FadeIn}
            exiting={FadeOut}
            onLayout={onLayoutRootView}
            style={{ flex: 1 }}
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
        </Reanimated.View>
    );
};

export default Layout;
