export interface Colors {
    primaryText: string;
    secondaryText: string;
    invertedText: string;
    invertedOnAccent: string;
    primaryBackground: string;
    secondaryBackground: string;
    overlayPrimaryBackground: string;
    primaryAccent: string;
    secondaryAccent: string;
    primaryBorder: string;
    primaryShadow: string;
    success: string;
    warning: string;
}

export interface Reservation {
    createdAt: string;
    reservationDate: string;
    name: string;
    typeOfService: string;
    id: string;
    isPaid: boolean;
    price: string;
}
