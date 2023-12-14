import { FlatList, View } from 'react-native';
import { inventoryItems } from '../../constants/inventory-items';
import InventoryItem from './InventoryItem';
import { useCallback } from 'react';
import { Inventory } from '../../types';

const InventoryList = () => {
    const renderItem = useCallback(({ index, item }: { item: Inventory; index: number }) => {
        return <InventoryItem {...item} index={index} />;
    }, []);

    return (
        <View>
            <FlatList
                data={inventoryItems}
                renderItem={renderItem}
                keyExtractor={item => item.name}
                numColumns={2}
                key={'_'}
                contentContainerStyle={{ gap: 16 }}
            />
        </View>
    );
};

export default InventoryList;
