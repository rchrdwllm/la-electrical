import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Reservation } from '../../types';
import ReservationRenderItem from './ReservationRenderItem';
import SectionHeader from './SectionHeader';
import ScreenLoader from '../shared/ScreenLoader';
import ListHeader from '../shared/ListHeader';
import TextInput from '../shared/TextInput';
import { useEffect, useMemo, useState } from 'react';
import { fetchReservations, groupByPayment } from '../../utils/reservations';

const ReservationsList = () => {
    const styles = styling();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const groupedReservations: (string | Reservation)[] = useMemo(() => {
        return groupByPayment(reservations);
    }, [reservations]);

    const getReservations = async () => {
        setIsLoading(true);

        await fetchReservations(setReservations);

        setIsLoading(false);
        setRefreshing(false);
    };

    const onRefresh = () => {
        setRefreshing(true);
    };

    useEffect(() => {
        getReservations();
    }, []);

    useEffect(() => {
        if (refreshing) {
            getReservations();
        }
    }, [refreshing]);

    return (
        <View style={styles.container}>
            {isLoading && <ScreenLoader />}
            <View style={styles.listContainer}>
                <FlatList
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
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
