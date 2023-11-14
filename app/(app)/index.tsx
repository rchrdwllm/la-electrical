import { View, StyleSheet } from 'react-native';
import Button from '../../components/base/Button';
import { Colors } from '../../types';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useState } from 'react';

const Admin = () => {
    const [loading, setLoading] = useState(false);
    const [_, setUser] = useAuth();
    const { palette } = useTheme();
    const styles = styling(palette);

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
            <Button
                loading={loading}
                disabled={loading}
                showText={!loading}
                text="Sign out"
                onPress={handleSignOut}
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
        },
    });

export default Admin;
