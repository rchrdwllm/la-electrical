import { View, StyleSheet } from 'react-native';
import Text from '../shared/Text';
import { Colors } from '../../types';
import ReservationItem from './ReservationItem';
import { ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Reservation } from '../../types';
import Button from '../shared/Button';
import Reanimated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { useEffect, useState } from 'react';
import {
    fetchReservations,
    getSavedReservations,
    storeReservations,
} from '../../utils/reservations';

const ReservationsSection = () => {
    const { palette } = useTheme();
    const styles = styling(palette);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getReservations = async () => {
        setIsLoading(true);

        const reservations = await fetchReservations();

        setReservations(reservations.filter(reservation => !reservation.isPaid).splice(0, 3));
        setIsLoading(false);
    };

    useEffect(() => {
        getReservations();
    }, []);

    return (
        <View>
            <Text fontWeight="medium">Reservations</Text>
            {isLoading ? (
                <Reanimated.View
                    key="loader"
                    entering={FadeIn}
                    exiting={FadeOut}
                    style={styles.loadingContainer}
                >
                    <ActivityIndicator color={palette.primaryAccent} />
                </Reanimated.View>
            ) : (
                <Reanimated.View
                    key="reservations"
                    entering={FadeIn}
                    exiting={FadeOut}
                    style={styles.reservationsContainer}
                >
                    {reservations.map(reservation => (
                        <ReservationItem key={reservation.id} {...reservation} />
                    ))}
                    <View style={styles.viewAllBtnContainer}>
                        <Link asChild href="/reservations">
                            <Button style={styles.viewAllBtn} text="View all" variant="tertiary" />
                        </Link>
                    </View>
                </Reanimated.View>
            )}
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        reservationsContainer: {
            marginTop: 16,
            backgroundColor: palette.secondaryBackground,
            borderRadius: 24,
            elevation: 10,
            shadowColor: palette.primaryShadow,
            shadowOffset: {
                width: 0,
                height: 7,
            },
            shadowOpacity: 0.3,
            shadowRadius: 9.11,
        },
        loadingContainer: {
            padding: 32,
            justifyContent: 'center',
            alignItems: 'center',
        },
        viewAllBtnContainer: {
            width: '100%',
            alignItems: 'flex-end',
        },
        viewAllBtn: {
            paddingVertical: 16,
            paddingHorizontal: 16,
            width: 'auto',
        },
    });

export default ReservationsSection;
