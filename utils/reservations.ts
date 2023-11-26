import 'react-native-get-random-values';
import { Reservation } from '../types';
import { Timestamp, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { v4 as uuid } from 'uuid';

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

export const updateReservation = async (id: string, data: Partial<Reservation>) => {
    await updateDoc(doc(firestore, 'reservations', id), {
        ...data,
    });
};

export const payReservation = async (id: string) => {
    await updateDoc(doc(firestore, 'reservations', id), {
        isPaid: true,
    });
};

export const unpayReservation = async (id: string) => {
    await updateDoc(doc(firestore, 'reservations', id), {
        isPaid: false,
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
