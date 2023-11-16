import { View, StyleSheet } from 'react-native';
import Text from '../shared/Text';
import { Colors } from '../../types';
import ReservationItem from './ReservationItem';
import { useTheme } from '../../hooks/useTheme';

const ReservationsSection = () => {
    const { palette } = useTheme();
    const styles = styling(palette);

    return (
        <View>
            <Text fontWeight="medium">Reservations</Text>
            <View style={styles.reservationsContainer}>
                <ReservationItem />
                <ReservationItem />
                <ReservationItem />
                <ReservationItem />
                <ReservationItem />
            </View>
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        reservationsContainer: {
            marginTop: 16,
            backgroundColor: palette.secondaryBackground,
            borderRadius: 24,
            elevation: 10,
            shadowColor: palette.primaryShadow,
            shadowOffset: {
                width: 0,
                height: 7,
            },
            shadowOpacity: 0.3,
            shadowRadius: 9.11,
        },
    });

export default ReservationsSection;
