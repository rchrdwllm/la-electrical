import { create } from 'zustand';
import { Reservation } from '../types';

interface Store {
    reservations: Reservation[];
    setReservations: (reservations: Reservation[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    isRefreshing: boolean;
    setIsRefreshing: (isRefreshing: boolean) => void;
}

export const useReservationsStore = create<Store>(set => ({
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
}));
