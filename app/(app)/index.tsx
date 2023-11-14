import { View, StyleSheet } from 'react-native';
import Button from '../../components/base/Button';
import { Colors } from '../../types';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useState } from 'react';
import Text from '../../components/base/Text';

const Admin = () => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useAuth();
    const { palette } = useTheme();
    const styles = styling(palette);

    if (!user) return null;

    const handleSignOut = async () => {
        setLoading(true);

        await new Promise(resolve => {
            setTimeout(async () => {
                await signOut(firebaseAuth);

                resolve('Logged out');
            }, 1000);
        });

        setLoading(false);
        setUser(null);
    };

    return (
        <View style={styles.container}>
            <Text>Email: {user.email}</Text>
            <Button
                loading={loading}
                disabled={loading}
                showText={!loading}
                text="Sign out"
                onPress={handleSignOut}
                style={styles.logoutBtn}
            />
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: palette.primaryBackground,
            paddingTop: 48,
            paddingHorizontal: 16,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
        },
        logoutBtn: {
            width: '100%',
        },
    });

export default Admin;
