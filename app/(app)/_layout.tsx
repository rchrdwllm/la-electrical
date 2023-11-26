import { Redirect, Stack } from 'expo-router';
import Reanimated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Colors, Reservation } from '../../types';
import { StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth, firestore } from '../../config/firebase';
import { useTheme } from '../../hooks/useTheme';
import { useReservationsStore } from '../../zustand/store';
import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';

const Layout = () => {
    const [user, setUser] = useAuth();
    const { setReservations, setIsLoading, isRefreshing, setIsRefreshing } = useReservationsStore();
    const { palette } = useTheme();
    const styles = styling(palette);

    useEffect(() => {
        setIsLoading(true);

        const reservationsCollection = collection(firestore, 'reservations');
        const reservationsQuery = query(reservationsCollection, orderBy('reservationDate', 'asc'));

        onSnapshot(reservationsQuery, snapshot => {
            const reservationsData: Reservation[] = [];

            snapshot.forEach(doc => {
                const reservation = doc.data() as Reservation;
                reservationsData.push(reservation);
            });

            setReservations(reservationsData);
            setIsLoading(false);
            setIsRefreshing(false);
        });
    }, []);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, user => {
            setUser(user);
        });
    }, []);

    const onRefresh = async () => {
        setIsLoading(true);

        const newReservations: Reservation[] = [];
        const reservationsCollection = collection(firestore, 'reservations');
        const reservationsQuery = query(reservationsCollection, orderBy('reservationDate', 'asc'));
        const reservationsSnapshot = await getDocs(reservationsQuery);

        reservationsSnapshot.forEach(doc => {
            const reservation = doc.data() as Reservation;
            newReservations.push(reservation);
        });

        setReservations(newReservations);
        setIsRefreshing(false);
        setIsLoading(false);
    };

    useEffect(() => {
        if (isRefreshing) {
            onRefresh();
        }
    }, [isRefreshing]);

    if (!user) return <Redirect href="/sign-in" />;

    return (
        <Reanimated.View entering={FadeIn.delay(250)} exiting={FadeOut} style={styles.container}>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="reservations" />
                <Stack.Screen name="inventory" />
                <Stack.Screen
                    name="search"
                    options={{
                        animation: 'fade_from_bottom',
                    }}
                />
                <Stack.Screen name="new" />
            </Stack>
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
