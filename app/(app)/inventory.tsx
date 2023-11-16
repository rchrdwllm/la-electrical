import { View, StyleSheet } from 'react-native';
import Text from '../../components/shared/Text';
import { Colors } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { useEffect } from 'react';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';

const Inventory = () => {
    const { theme, palette } = useTheme();
    const styles = styling(palette);

    useEffect(() => {
        setTimeout(() => {
            setStatusBarStyle(theme === 'light' ? 'dark' : 'light');
        }, 570);
    }, [theme]);

    return (
        <View style={styles.container}>
            <StatusBar animated style={theme === 'light' ? 'dark' : 'light'} />
            <Text style={styles.text}>Inventory</Text>
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: palette.primaryBackground,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            color: palette.primaryText,
        },
    });

export default Inventory;
