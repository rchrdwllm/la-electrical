import { Timestamp } from 'firebase/firestore';

export interface Colors {
    primaryText: string;
    secondaryText: string;
    invertedText: string;
    invertedOnAccent: string;
    primaryBackground: string;
    secondaryBackground: string;
    overlayPrimaryBackground: string;
    overlayInvertedBackground: string;
    primaryAccent: string;
    secondaryAccent: string;
    primaryBorder: string;
    primaryShadow: string;
    accentShadow: string;
    success: string;
    warning: string;
    black: string;
    modalBackground: string;
}

export interface Service {
    name: string;
    price: number;
}

export interface Reservation {
    reservationDate: Timestamp;
    name: string;
    typeOfService: string;
    id: string;
    isPaid: boolean;
    price: number;
    modeOfPayment: string;
}

export interface SearchCategory {
    title: string;
    onPress: () => void;
}
