import { RefreshControl, StyleSheet, View } from 'react-native';
import { Reservation } from '../../types';
import ReservationRenderItem from './ReservationRenderItem';
import SectionHeader from './SectionHeader';
import ListHeader from '../shared/ListHeader';
import TextInput from '../shared/TextInput';
import ScreenLoader from '../shared/ScreenLoader';
import Reanimated, { Layout } from 'react-native-reanimated';
import NewButton from '../shared/NewButton';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { groupByPayment } from '../../utils/reservations';
import { useReservationsStore } from '../../zustand/store';
import { useTheme } from '../../hooks/useTheme';

const ReservationsList = () => {
    const { palette } = useTheme();
    const styles = styling();
    const [initialLoading, setInitialLoading] = useState(true);
    const { reservations, isLoading, isRefreshing, setIsRefreshing } = useReservationsStore();
    const [search, setSearch] = useState('');
    const groupedReservations: (string | Reservation)[] = useMemo(() => {
        if (search) {
            const filteredReservations = reservations.filter(reservations => {
                const { name, typeOfService, price, reservationDate } = reservations;
                return (
                    name.toLowerCase().includes(search.toLowerCase()) ||
                    typeOfService.toLowerCase().includes(search.toLowerCase()) ||
                    price.toString().toLowerCase().includes(search.toLowerCase()) ||
                    `${Intl.DateTimeFormat(navigator.language, {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                    }).format(reservationDate.toDate())} ${Intl.DateTimeFormat('en', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    }).format(new Date(reservationDate.toDate()))}`
                        .toLowerCase()
                        .includes(search.toLowerCase())
                );
            });

            return groupByPayment(filteredReservations);
        }

        return groupByPayment(reservations);
    }, [reservations, search]);

    useEffect(() => {
        if (initialLoading && groupedReservations.length) {
            setTimeout(() => {
                setInitialLoading(false);
            }, 500);
        }
    }, [groupedReservations]);

    const renderItem = useCallback(({ item }: { item: Reservation | string }) => {
        if (typeof item === 'string') {
            return <SectionHeader title={item} />;
        } else {
            return <ReservationRenderItem {...item} />;
        }
    }, []);

    return (
        <View style={styles.container}>
            {(isLoading || initialLoading) && <ScreenLoader />}
            <View style={styles.listHeader}>
                <ListHeader />
                <TextInput
                    placeholder="Search reservations"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            <View style={styles.listContainer}>
                <Reanimated.FlatList
                    layout={Layout}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => setIsRefreshing(true)}
                            colors={[palette.primaryAccent]}
                            progressBackgroundColor={palette.primaryBackground}
                        />
                    }
                    data={groupedReservations}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => JSON.stringify(item) + index}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 32,
                    }}
                    initialNumToRender={7}
                    maxToRenderPerBatch={10}
                    windowSize={3}
                />
            </View>
            <NewButton />
        </View>
    );
};

const styling = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            position: 'relative',
        },
        listHeader: {
            paddingHorizontal: 16,
            paddingBottom: 16,
            gap: 16,
        },
        listContainer: {
            flex: 1,
        },
    });

export default ReservationsList;
