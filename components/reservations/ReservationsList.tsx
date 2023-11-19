import { StyleSheet, View } from 'react-native';
import { Colors, Reservation } from '../../types';
import { FlashList } from '@shopify/flash-list';
import ReservationRenderItem from './ReservationRenderItem';
import SectionHeader from './SectionHeader';
import ListEmptyLoader from '../shared/ListEmptyLoader';
import ListHeader from '../shared/ListHeader';
import TextInput from '../shared/TextInput';
import { useEffect, useMemo, useState } from 'react';
import {
    fetchReservations,
    getSavedReservations,
    groupByPayment,
    storeReservations,
} from '../../utils/reservations';

const ReservationsList = () => {
    const styles = styling();
    const [isLoading, setIsLoading] = useState(true);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const groupedReservations: (string | Reservation)[] = useMemo(() => {
        return groupByPayment(reservations);
    }, [reservations]);

    const getReservations = async () => {
        setIsLoading(true);

        const savedReservations = await getSavedReservations();

        if (savedReservations) {
            setReservations(savedReservations);
        } else {
            const reservations = await fetchReservations();

            setReservations(reservations);

            await storeReservations(reservations);
        }
    };

    useEffect(() => {
        getReservations();
    }, []);

    return (
        <View style={styles.container}>
            {isLoading && <ListEmptyLoader />}
            <View style={styles.listContainer}>
                <FlashList
                    data={groupedReservations}
                    renderItem={({ item }) => {
                        if (typeof item === 'string') {
                            return <SectionHeader title={item} />;
                        } else {
                            return <ReservationRenderItem {...item} />;
                        }
                    }}
                    keyExtractor={(item, index) => JSON.stringify(item) + index}
                    getItemType={item => {
                        return typeof item === 'string' ? 'section-header' : 'reservation';
                    }}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 32,
                    }}
                    ListHeaderComponentStyle={{
                        gap: 16,
                    }}
                    estimatedItemSize={50}
                    ListHeaderComponent={() => (
                        <>
                            <ListHeader />
                            <TextInput placeholder="Search reservations" />
                        </>
                    )}
                    onLoad={() => setIsLoading(false)}
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
