import { StyleSheet } from 'react-native';
import { Colors } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { useEffect, useState } from 'react';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import ListHeader from '../../components/shared/ListHeader';
import TextInput from '../../components/shared/TextInput';
import InventoryList from '../../components/inventory/InventoryList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EditInventory from '../../components/shared/EditInventory';
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const Inventory = () => {
    const { theme, palette } = useTheme();
    const styles = styling(palette);
    const [inventoryToEdit, setInventoryToEdit] = useState<null | number>(null);
    const scaleValue = useSharedValue(1);
    const borderRadiusValue = useSharedValue(0);

    const animatedScale = useAnimatedStyle(() => ({
        transform: [
            {
                scale: scaleValue.value,
            },
        ],
        borderRadius: borderRadiusValue.value,
    }));

    useEffect(() => {
        if (inventoryToEdit) {
            scaleValue.value = withTiming(0.9);
            borderRadiusValue.value = withTiming(8);
        } else {
            scaleValue.value = withTiming(1);
            borderRadiusValue.value = withTiming(1);
        }
    }, [inventoryToEdit]);

    useEffect(() => {
        setTimeout(() => {
            setStatusBarStyle(theme === 'light' ? 'dark' : 'light');
        }, 570);
    }, [theme]);

    return (
        <GestureHandlerRootView style={styles.parentContainer}>
            <StatusBar animated style={theme === 'light' ? 'dark' : 'light'} />
            <Reanimated.View style={[styles.container, animatedScale]}>
                <InventoryList setInventoryToEdit={setInventoryToEdit} />
            </Reanimated.View>
            {inventoryToEdit && (
                <EditInventory
                    inventoryToEdit={inventoryToEdit}
                    setInventoryToEdit={setInventoryToEdit}
                />
            )}
        </GestureHandlerRootView>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        parentContainer: {
            flex: 1,
            backgroundColor: palette.black,
        },
        container: {
            flex: 1,
            backgroundColor: palette.primaryBackground,
            position: 'relative',
            overflow: 'hidden',
        },
        text: {
            color: palette.primaryText,
            fontSize: 23,
        },
    });

export default Inventory;
