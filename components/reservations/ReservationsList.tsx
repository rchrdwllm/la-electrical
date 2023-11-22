import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Reservation } from '../../types';
import ReservationRenderItem from './ReservationRenderItem';
import SectionHeader from './SectionHeader';
import ScreenLoader from '../shared/ScreenLoader';
import ListHeader from '../shared/ListHeader';
import TextInput from '../shared/TextInput';
import { useMemo } from 'react';
import { groupByPayment } from '../../utils/reservations';
import { useReservationsStore } from '../../zustand/store';
import { useTheme } from '../../hooks/useTheme';

const ReservationsList = () => {
    const { palette } = useTheme();
    const styles = styling();
    const { reservations, isLoading, isRefreshing, setIsRefreshing } = useReservationsStore();
    const groupedReservations: (string | Reservation)[] = useMemo(() => {
        return groupByPayment(reservations);
    }, [reservations]);

    return (
        <View style={styles.container}>
            {isLoading && <ScreenLoader />}
            <View style={styles.listContainer}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => setIsRefreshing(true)}
                            colors={[palette.primaryAccent]}
                            progressBackgroundColor={palette.primaryBackground}
                        />
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
