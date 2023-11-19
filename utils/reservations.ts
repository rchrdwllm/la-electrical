import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reservation } from '../types';

export const fetchReservations = async () => {
    const res = await fetch(
        'https://6555e2c384b36e3a431e9158.mockapi.io/api/la-electrical/reservations'
    );
    const data: Reservation[] = await res.json();
    const sortedData = data.sort((a, b) => {
        return new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime();
    });

    return sortedData;
};

export const groupByPayment = (reservations: Reservation[]) => {
    const paidReservations: (string | Reservation)[] = [];
    const unpaidReservations: (string | Reservation)[] = [];

    reservations.forEach(reservation => {
        if (reservation.isPaid) {
            paidReservations.push(reservation);
        } else {
            unpaidReservations.push(reservation);
        }
    });

    paidReservations.unshift('Paid reservations');
    unpaidReservations.unshift('Pending payment');

    return [...paidReservations, ...unpaidReservations];
};

export const storeReservations = async (reservations: Reservation[]) => {
    try {
        await AsyncStorage.setItem('reservations', JSON.stringify(reservations));
    } catch (err) {
        console.log(err);
    }
};

export const getSavedReservations = async () => {
    let savedReservations: Reservation[] | null = null;

    try {
        const reservationsJson = await AsyncStorage.getItem('reservations');

        if (reservationsJson) {
            savedReservations = JSON.parse(reservationsJson);
        }
    } catch (err) {
        console.log(err);
    }

    return savedReservations;
};
