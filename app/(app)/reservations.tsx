import { View, StyleSheet } from 'react-native';
import { Colors } from '../../types';
import ReservationsList from '../../components/reservations/ReservationsList';
import EditReservation from '../../components/shared/EditReservation';
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Reservations = () => {
    const { theme, palette } = useTheme();
    const styles = styling(palette);
    const { top } = useSafeAreaInsets();
    const [reservationToEdit, setReservationToEdit] = useState<string | null>(null);
    const scaleValue = useSharedValue(1);
    const borderRadiusValue = useSharedValue(0);

    useEffect(() => {
        setTimeout(() => {
            setStatusBarStyle(theme === 'light' ? 'dark' : 'light');
        }, 570);
    }, [theme]);

    const animatedScale = useAnimatedStyle(() => ({
        transform: [
            {
                scale: scaleValue.value,
            },
        ],
        borderRadius: borderRadiusValue.value,
    }));

    useEffect(() => {
        if (reservationToEdit) {
            scaleValue.value = withTiming(0.9);
            borderRadiusValue.value = withTiming(8);
        } else {
            scaleValue.value = withTiming(1);
            borderRadiusValue.value = withTiming(1);
        }
    }, [reservationToEdit]);

    return (
        <GestureHandlerRootView style={styles.parentContainer}>
            <StatusBar animated style={theme === 'light' ? 'dark' : 'light'} />
            <View
                style={[
                    styles.safeAreaView,
                    {
                        height: top,
                    },
                ]}
            ></View>
            <Reanimated.View style={[styles.container, animatedScale]}>
                <View style={{ flex: 1 }}>
                    <ReservationsList setReservationToEdit={setReservationToEdit} />
                </View>
            </Reanimated.View>
            {reservationToEdit && (
                <EditReservation
                    reservationToEdit={reservationToEdit}
                    setReservationToEdit={setReservationToEdit}
                />
            )}
        </GestureHandlerRootView>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        parentContainer: {
            flex: 1,
            backgroundColor: palette.black,
        },
        container: {
            flex: 1,
            backgroundColor: palette.primaryBackground,
            position: 'relative',
            overflow: 'hidden',
        },
        safeAreaView: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 3,
        },
        text: {
            color: palette.primaryText,
        },
    });

export default Reservations;
