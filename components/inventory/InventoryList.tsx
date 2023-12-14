import { FlatList, View } from 'react-native';
import InventoryItem from './InventoryItem';
import { useCallback } from 'react';
import { useInventoryStore } from '../../zustand/store';
import { Inventory } from '../../types';

interface InventoryListProps {
    setInventoryToEdit: (id: number) => void;
}

const InventoryList = ({ setInventoryToEdit }: InventoryListProps) => {
    const { inventoryItems } = useInventoryStore();

    const renderItem = useCallback(({ index, item }: { item: Inventory; index: number }) => {
        return (
            <InventoryItem
                setInventoryToEdit={setInventoryToEdit}
                {...item}
                image={item.image}
                index={index}
            />
        );
    }, []);

    return (
        <View>
            <FlatList
                data={inventoryItems}
                renderItem={renderItem}
                keyExtractor={item => item.name}
                numColumns={2}
                key={'_'}
                contentContainerStyle={{ gap: 16, paddingBottom: 32 }}
                style={{ marginTop: 16 }}
            />
        </View>
    );
};

export default InventoryList;
