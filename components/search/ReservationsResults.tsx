import { useCallback } from 'react';
import { View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import ReservationRenderItem from '../reservations/ReservationRenderItem';
import { Reservation } from '../../types';

interface ReservationsResultsProps {
    reservations: Reservation[];
    setReservationToEdit: (id: string) => void;
}

const ReservationsResults = ({ reservations, setReservationToEdit }: ReservationsResultsProps) => {
    const renderItem = useCallback(
        ({ item }: { item: Reservation }) => (
            <ReservationRenderItem {...item} setReservationToEdit={setReservationToEdit} />
        ),
        []
    );

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <Reanimated.FlatList
                data={reservations}
                renderItem={renderItem}
                keyExtractor={(item, index) => JSON.stringify(item) + index}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 32,
                }}
                initialNumToRender={7}
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>
    );
};

export default ReservationsResults;
