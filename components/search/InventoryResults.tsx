import { View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import ReservationRenderItem from '../reservations/ReservationRenderItem';
import { Inventory, Reservation } from '../../types';
import { useCallback, memo } from 'react';
import InventoryItem from '../inventory/InventoryItem';

interface InventoryResultsProps {
    inventoryItems: Inventory[];
    setInventoryToEdit: (id: number) => void;
}

const InventoryResults = ({ inventoryItems, setInventoryToEdit }: InventoryResultsProps) => {
    const renderItem = useCallback(
        ({ item, index }: { item: Inventory; index: number }) => (
            <InventoryItem {...item} index={index} setInventoryToEdit={setInventoryToEdit} />
        ),
        [inventoryItems]
    );

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <Reanimated.FlatList
                data={inventoryItems}
                renderItem={renderItem}
                keyExtractor={(item, index) => JSON.stringify(item) + index}
                contentContainerStyle={{
                    paddingBottom: 32,
                    gap: 16,
                }}
                initialNumToRender={7}
                maxToRenderPerBatch={10}
                windowSize={5}
                numColumns={2}
                key="+"
            />
        </View>
    );
};

export default memo(InventoryResults);
