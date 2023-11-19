import { View, StyleSheet } from 'react-native';
import { Colors } from '../../types';
import ReservationsList from '../../components/reservations/ReservationsList';
import { useTheme } from '../../hooks/useTheme';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Reservations = () => {
    const { theme, palette } = useTheme();
    const styles = styling(palette);
    const { top } = useSafeAreaInsets();

    useEffect(() => {
        setTimeout(() => {
            setStatusBarStyle(theme === 'light' ? 'dark' : 'light');
        }, 570);
    }, [theme]);

    return (
        <View style={styles.container}>
            <StatusBar animated style={theme === 'light' ? 'dark' : 'light'} />
            <View
                style={[
                    styles.safeAreaView,
                    {
                        height: top,
                    },
                ]}
            ></View>
            <ReservationsList />
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: palette.primaryBackground,
            position: 'relative',
        },
        safeAreaView: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            backgroundColor: palette.primaryBackground,
            zIndex: 3,
        },
        text: {
            color: palette.primaryText,
        },
    });

export default Reservations;
