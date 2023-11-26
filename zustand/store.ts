import { create } from 'zustand';
import { Reservation } from '../types';

interface Store {
    reservations: Reservation[];
    setReservations: (reservations: Reservation[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    isRefreshing: boolean;
    setIsRefreshing: (isRefreshing: boolean) => void;
    reservationById: (id: string) => Reservation;
}

export const useReservationsStore = create<Store>((set, get) => ({
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
