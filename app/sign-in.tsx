import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Pressable,
    ImageBackground,
    Image,
} from 'react-native';
import { Colors } from '../types';
import Text from '../components/shared/Text';
import TextInput from '../components/shared/TextInput';
import Button from '../components/shared/Button';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { firebaseAuth } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useTheme } from '../hooks/useTheme';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { router } from 'expo-router';

const SignIn = () => {
    const { theme, palette } = useTheme();
    const styles = styling(palette);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useAuth();

    useEffect(() => {
        if (user) router.replace('/(app)');
    }, [user]);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, user => {
            setUser(user);
        });
    }, []);

    useEffect(() => {
        setStatusBarStyle('light');
    }, [theme]);

    const signIn = async () => {
        Keyboard.dismiss();

        setLoading(true);

        try {
            const res = await signInWithEmailAndPassword(firebaseAuth, email, password);

            setUser(res.user);
            router.replace('/(app)');
        } catch (error: any) {
            console.log(error);

            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar animated style="light" />
            <Pressable style={styles.backgroundContainer} onPress={Keyboard.dismiss}>
                <ImageBackground
                    style={styles.background}
                    source={require('../assets/header_bg.png')}
                >
                    <View style={styles.backgroundText}>
                        <Image
                            style={styles.backgroundLogo}
                            source={require('../assets/logo_light.png')}
                        />
                        <Text fontWeight="bold" style={styles.logoText}>
                            LAE.
                        </Text>
                    </View>
                    <Text style={styles.logoSubtext}>Lath's Auto-Electrical Shop</Text>
                </ImageBackground>
            </Pressable>
            <Pressable style={styles.signInContainer} onPress={Keyboard.dismiss}>
                <Text style={styles.signInText} fontWeight="bold">
                    Sign in
                </Text>
                <Text style={styles.subtext}>
                    Sign in to elevate the admin experience{'\n'} with LAES
                </Text>
                <View style={styles.forms}>
                    <TextInput
                        value={email}
                        onChangeText={text => setEmail(text)}
                        placeholder="Admin email"
                    />
                    <TextInput
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry
                        placeholder="Admin password"
                    />
                    <Button
                        text="Sign in"
                        loading={loading}
                        showText={!loading}
                        disabled={loading}
                        onPress={signIn}
                    />
                </View>
                <Text style={styles.copyright}>Copyright 2023. All rights reserved.</Text>
            </Pressable>
        </KeyboardAvoidingView>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: palette.primaryAccent,
        },
        backgroundContainer: {
            flex: 1,
        },
        background: {
            flex: 1,
            objectFit: 'cover',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
        },
        backgroundLogo: {
            height: 80,
            width: 80,
        },
        backgroundText: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
        },
        logoText: {
            fontSize: 64,
            color: palette.invertedOnAccent,
        },
        logoSubtext: {
            color: palette.invertedOnAccent,
        },
        signInContainer: {
            backgroundColor: palette.primaryBackground,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            paddingHorizontal: 32,
            paddingVertical: 48,
            marginTop: -32,
        },
        signInText: {
            fontSize: 32,
            textAlign: 'center',
        },
        subtext: {
            marginTop: 16,
            color: palette.secondaryText,
            textAlign: 'center',
        },
        forms: {
            marginTop: 48,
            gap: 16,
        },
        copyright: {
            marginTop: 48,
            textAlign: 'center',
            color: palette.secondaryText,
        },
    });

export default SignIn;
