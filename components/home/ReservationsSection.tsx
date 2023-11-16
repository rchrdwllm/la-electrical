import { View, StyleSheet } from 'react-native';
import Text from '../shared/Text';
import { Colors } from '../../types';
import ReservationItem from './ReservationItem';
import { Link } from 'expo-router';
import { Reservation } from '../../types';
import Button from '../shared/Button';
import { useTheme } from '../../hooks/useTheme';
import { useEffect, useMemo, useState } from 'react';
import { fetchReservations } from '../../utils/reservations';

const ReservationsSection = () => {
    const { palette } = useTheme();
    const styles = styling(palette);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        fetchReservations().then(fetchedReservations => {
            setReservations(fetchedReservations.splice(0, 3));
        });
    }, []);

    return (
        <View>
            <Text fontWeight="medium">Reservations</Text>
            <View style={styles.reservationsContainer}>
                {reservations.map(reservation => (
                    <ReservationItem key={reservation.id} {...reservation} />
                ))}
                <View style={styles.viewAllBtnContainer}>
                    <Link asChild href="/reservations">
                        <Button style={styles.viewAllBtn} text="View all" variant="tertiary" />
                    </Link>
                </View>
            </View>
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
