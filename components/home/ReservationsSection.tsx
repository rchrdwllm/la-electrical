import { View, StyleSheet } from 'react-native';
import Text from '../shared/Text';
import { Colors } from '../../types';
import ReservationItem from './ReservationItem';
import { ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Dispatch, SetStateAction, useMemo } from 'react';
import Button from '../shared/Button';
import Reanimated, { FadeIn, FadeOut } from 'react-native-reanimated';
import ListEmpty from '../shared/ListEmpty';
import { useTheme } from '../../hooks/useTheme';
import { useReservationsStore } from '../../zustand/store';

interface ReservationsSectionProps {
    reservationToEdit: string | null;
    setReservationToEdit: Dispatch<SetStateAction<string | null>>;
}

const ReservationsSection = ({
    reservationToEdit,
    setReservationToEdit,
}: ReservationsSectionProps) => {
    const { palette } = useTheme();
    const styles = styling(palette);
    const { reservations, isRefreshing, isLoading } = useReservationsStore();
    const cutReservations = useMemo(() => {
        if (reservations.length) {
            return [...reservations].splice(0, 3);
        }
    }, [reservations]);

    return (
        <View>
            <Text fontWeight="medium">Reservations</Text>
            {isLoading || isRefreshing ? (
                <Reanimated.View
                    key="loader"
                    entering={FadeIn}
                    exiting={FadeOut}
                    style={styles.loadingContainer}
                >
                    <ActivityIndicator color={palette.primaryAccent} />
                </Reanimated.View>
            ) : cutReservations ? (
                <Reanimated.View
                    key="reservations"
                    entering={FadeIn}
                    exiting={FadeOut}
                    style={styles.reservationsContainer}
                >
                    {cutReservations.map(reservation => (
                        <ReservationItem
                            key={reservation.id}
                            reservationToEdit={reservationToEdit}
                            setReservationToEdit={setReservationToEdit}
                            {...reservation}
                        />
                    ))}
                    <View style={styles.viewAllBtnContainer}>
                        <Link asChild href="/reservations">
                            <Button style={styles.viewAllBtn} text="View all" variant="tertiary" />
                        </Link>
                    </View>
                </Reanimated.View>
            ) : (
                <ListEmpty />
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
