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
