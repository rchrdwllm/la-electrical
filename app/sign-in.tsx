import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Pressable,
    ImageBackground,
} from 'react-native';
import { Colors } from '../types';
import Text from '../components/base/Text';
import TextInput from '../components/base/TextInput';
import Button from '../components/base/Button';
import { firebaseAuth } from '../config/firebase';
import { setStatusBarStyle } from 'expo-status-bar';
import { User, signInWithEmailAndPassword } from 'firebase/auth';
import { useTheme } from '../hooks/useTheme';
import { useEffect, useState } from 'react';

const SignIn = () => {
    const { palette } = useTheme();
    const styles = styling(palette);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
        setLoading(true);

        try {
            const res = await signInWithEmailAndPassword(firebaseAuth, email, password);

            alert(JSON.stringify(res.user));
        } catch (error: any) {
            console.log(error);

            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setStatusBarStyle('light');
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Pressable style={styles.backgroundContainer} onPress={Keyboard.dismiss}>
                <ImageBackground
                    style={styles.background}
                    source={require('../assets/sign-in-header.png')}
                >
                    <Text fontWeight="bold" style={styles.logoText}>
                        LAE.
                    </Text>
                    <Text style={styles.logoSubtext}>Lath's Auto-Electrical Shop</Text>
                </ImageBackground>
            </Pressable>
            <Pressable style={styles.signInContainer} onPress={Keyboard.dismiss}>
                <Text style={styles.signInText} fontWeight="bold">
                    Sign in
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
