import { Reservation } from '../types';
import { firestore } from '../config/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Dispatch, SetStateAction } from 'react';

export const fetchReservations = async (
    setReservations: Dispatch<SetStateAction<Reservation[]>>
) => {
    const reservationsCollection = collection(firestore, 'reservations');
    const reservationsQuery = query(reservationsCollection);

    onSnapshot(reservationsQuery, snapshot => {
        const reservationsData: Reservation[] = [];

        snapshot.forEach(doc => {
            const reservation = doc.data() as Reservation;
            reservationsData.push(reservation);
        });

        setReservations(reservationsData);
    });
};

export const groupByPayment = (reservations: Reservation[]) => {
    const paidReservations: (string | Reservation)[] = reservations.filter(
        reservation => reservation.isPaid
    );
    const unpaidReservations: (string | Reservation)[] = reservations.filter(
        reservation => !reservation.isPaid
    );

    paidReservations.unshift('Paid reservations');
    unpaidReservations.unshift('Pending payment');

    return [...paidReservations, ...unpaidReservations];
};
