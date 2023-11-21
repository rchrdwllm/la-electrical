import 'react-native-get-random-values';
import { Reservation } from '../types';
import { Dispatch, SetStateAction } from 'react';
import {
    collection,
    onSnapshot,
    query,
    addDoc,
    Timestamp,
    deleteDoc,
    where,
    doc,
    setDoc,
} from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { v4 as uuid } from 'uuid';

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

export const addReservation = async (data: {
    name: string;
    reservationDate: Date;
    typeOfService: string;
    modeOfPayment: string;
    isPaid: boolean;
    price: number;
}) => {
    const reservation = {
        ...data,
        reservationDate: Timestamp.fromDate(data.reservationDate),
        id: uuid(),
    };

    await setDoc(doc(firestore, 'reservations', reservation.id), {
        ...reservation,
    });
};

export const deleteReservation = async (id: string) => {
    await deleteDoc(doc(firestore, 'reservations', id));
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
