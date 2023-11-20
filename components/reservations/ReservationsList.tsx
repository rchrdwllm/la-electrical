import { FlatList, StyleSheet, View } from 'react-native';
import { Reservation } from '../../types';
import ReservationRenderItem from './ReservationRenderItem';
import SectionHeader from './SectionHeader';
import ListEmptyLoader from '../shared/ListEmptyLoader';
import ListHeader from '../shared/ListHeader';
import TextInput from '../shared/TextInput';
import { useEffect, useMemo, useState } from 'react';
import { fetchReservations, groupByPayment } from '../../utils/reservations';

const ReservationsList = () => {
    const styles = styling();
    const [isLoading, setIsLoading] = useState(true);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const groupedReservations: (string | Reservation)[] = useMemo(() => {
        return groupByPayment(reservations);
    }, [reservations]);

    const getReservations = async () => {
        setIsLoading(true);

        const reservations = await fetchReservations();

        setReservations(reservations);
        setIsLoading(false);
    };

    useEffect(() => {
        getReservations();
    }, []);

    return (
        <View style={styles.container}>
            {isLoading && <ListEmptyLoader />}
            <View style={styles.listContainer}>
                <FlatList
                    data={groupedReservations}
                    renderItem={({ item }) => {
                        if (typeof item === 'string') {
                            return <SectionHeader title={item} />;
                        } else {
                            return <ReservationRenderItem {...item} />;
                        }
                    }}
                    keyExtractor={(item, index) => JSON.stringify(item) + index}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 32,
                    }}
                    initialNumToRender={10}
                    ListHeaderComponentStyle={{
                        gap: 16,
                    }}
                    ListHeaderComponent={() => (
                        <>
                            <ListHeader />
                            <TextInput placeholder="Search reservations" />
                        </>
                    )}
                />
            </View>
        </View>
    );
};

const styling = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            position: 'relative',
        },
        listContainer: {
            flex: 1,
        },
    });

export default ReservationsList;
