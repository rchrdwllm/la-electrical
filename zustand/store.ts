import { create } from 'zustand';
import { Inventory, Reservation } from '../types';
import { inventoryItems } from '../constants/inventory-items';

interface ReservationsStore {
    reservations: Reservation[];
    setReservations: (reservations: Reservation[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    isRefreshing: boolean;
    setIsRefreshing: (isRefreshing: boolean) => void;
    reservationById: (id: string) => Reservation;
    
}

interface InventoryStore {
    inventoryItems: Inventory[];
    setInventoryItems: (inventoryItems: Inventory[]) => void;
    inventoryItemById: (id: number) => Inventory;
    editInventory: (id: number, newInventory: Inventory) => void;
}

export const useReservationsStore = create<ReservationsStore>((set, get) => ({
    reservations: [],
    setReservations: reservations =>
        set(() => ({
            reservations,
        })),
    isLoading: false,
    setIsLoading: isLoading =>
        set(() => ({
            isLoading,
        })),
    isRefreshing: false,
    setIsRefreshing: isRefreshing =>
        set(() => ({
            isRefreshing,
        })),
    reservationById: (id: string) => {
        return get().reservations.find(reservation => reservation.id === id)!;
    },
}));

export const useInventoryStore = create<InventoryStore>((set, get) => ({
    inventoryItems: inventoryItems,
    setInventoryItems: inventoryItems =>
        set(() => ({
            inventoryItems,
        })),
    inventoryItemById: (id: number) => {
        return get().inventoryItems.find(inventoryItem => inventoryItem.id === id)!;
    },
    editInventory: (id: number, newInventory: Inventory) => {
        const inventoryItems = get().inventoryItems;
        const index = inventoryItems.findIndex(inventoryItem => inventoryItem.id === id);
        inventoryItems[index] = newInventory;
        set(() => ({
            inventoryItems,
        }))
    }
}));