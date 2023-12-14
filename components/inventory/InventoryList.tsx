import { FlatList, StyleSheet, View } from 'react-native';
import InventoryItem from './InventoryItem';
import { Inventory } from '../../types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInventoryStore } from '../../zustand/store';
import ScreenLoader from '../shared/ScreenLoader';
import ListHeader from '../shared/ListHeader';
import TextInput from '../shared/TextInput';

interface InventoryListProps {
    setInventoryToEdit: (id: number) => void;
}

const InventoryList = ({ setInventoryToEdit }: InventoryListProps) => {
    const [initialLoading, setInitialLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { inventoryItems } = useInventoryStore();
    const styles = styling();
    const filteredItems: Inventory[] = useMemo(() => {
        if (search) {
            const filteredItems = inventoryItems.filter(item => {
                const { name, number } = item;

                return (
                    name.toLowerCase().includes(search.toLowerCase()) ||
                    number.toString().toLowerCase() === search.toLowerCase()
                );
            });

            return filteredItems;
        }

        return inventoryItems;
    }, [search, inventoryItems]);

    useEffect(() => {
        if (initialLoading && filteredItems.length) {
            setTimeout(() => {
                setInitialLoading(false);
            }, 500);
        }
    }, [filteredItems]);

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
        <View style={{ position: 'relative' }}>
            {initialLoading && <ScreenLoader />}
            <View style={styles.listHeader}>
                <ListHeader />
                <TextInput
                    placeholder="Search reservations"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            <FlatList
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={item => item.name}
                numColumns={2}
                key={'_'}
                contentContainerStyle={{ gap: 16, paddingBottom: 32, paddingHorizontal: 16 }}
                style={{ marginTop: 16 }}
            />
        </View>
    );
};

const styling = () =>
    StyleSheet.create({
        listHeader: {
            paddingHorizontal: 16,
            paddingBottom: 16,
            gap: 16,
        },
    });

export default InventoryList;
