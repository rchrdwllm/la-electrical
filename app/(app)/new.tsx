import { View, StyleSheet, Alert } from 'react-native';
import { Colors } from '../../types';
import TextInput from '../../components/shared/TextInput';
import NewReservationHeader from '../../components/new/NewReservationHeader';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import Button from '../../components/shared/Button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Select from '../../components/shared/Select';
import { useTheme } from '../../hooks/useTheme';
import { services } from '../../constants/types-of-services';
import { modesOfPayment } from '../../constants/modes-of-payment';
import { useEffect, useState } from 'react';
import { addReservation } from '../../utils/reservations';
import { router } from 'expo-router';

const New = () => {
    const { theme, palette } = useTheme();
    const styles = styling(palette);
    const [isLoading, setIsLoading] = useState(false);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [name, setName] = useState('');
    const [reservationDate, setReservationDate] = useState<Date | null>(null);
    const [typeOfService, setTypeOfService] = useState('');
    const [modeOfPayment, setModeOfPayment] = useState('');

    useEffect(() => {
        setTimeout(() => {
            setStatusBarStyle(theme === 'light' ? 'light' : 'dark');
        }, 570);
    }, [theme]);

    const handleConfirm = (date: Date) => {
        setReservationDate(date);
        setIsDatePickerVisible(false);
    };

    const handleCancel = () => {
        setIsDatePickerVisible(false);
    };

    const handleAdd = async () => {
        if (reservationDate && typeOfService && modeOfPayment && name) {
            setIsLoading(true);

            const reservation = {
                name,
                reservationDate,
                typeOfService,
                modeOfPayment,
                isPaid: false,
                price: services.find(service => service.name === typeOfService)?.price || 0,
            };

            try {
                await addReservation(reservation);

                setIsLoading(false);

                Alert.alert('Success!', 'Reservation has been added successfully!', [
                    {
                        text: 'Okay',
                        onPress: () => router.back(),
                    },
                ]);
            } catch (err) {
                console.log(err);
                setIsLoading(false);
            }
        } else {
            Alert.alert('Error', 'Please fill out all the fields before submitting the form.');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar animated style={theme === 'light' ? 'light' : 'dark'} />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                display="inline"
                accentColor={palette.primaryAccent}
                buttonTextColorIOS={palette.primaryAccent}
            />
            <NewReservationHeader />
            <View style={styles.forms}>
                <TextInput
                    style={{
                        backgroundColor:
                            theme === 'dark'
                                ? palette.overlayInvertedBackground
                                : palette.overlayPrimaryBackground,
                        color: palette.invertedText,
                    }}
                    placeholder="Name"
                    placeholderTextColor={palette.invertedText}
                    value={name}
                    onChangeText={setName}
                />
                <Button
                    text={
                        reservationDate
                            ? `${Intl.DateTimeFormat(navigator.language, {
                                  weekday: 'long',
                                  month: 'short',
                                  day: 'numeric',
                              }).format(reservationDate)} ${Intl.DateTimeFormat('en', {
                                  hour: 'numeric',
                                  minute: 'numeric',
                                  hour12: true,
                              }).format(new Date(reservationDate))}`
                            : 'Pick a date'
                    }
                    style={{
                        backgroundColor:
                            theme === 'dark'
                                ? palette.overlayInvertedBackground
                                : palette.overlayPrimaryBackground,
                        color: palette.invertedText,
                    }}
                    textStyle={{ textAlign: 'left' } as any}
                    onPress={() => setIsDatePickerVisible(true)}
                />
                <Select
                    data={services.map(service => service.name)}
                    style={{
                        backgroundColor:
                            theme === 'dark'
                                ? palette.overlayInvertedBackground
                                : palette.overlayPrimaryBackground,
                    }}
                    onChange={setTypeOfService}
                    placeholder="Select a service"
                />
                <Select
                    data={modesOfPayment}
                    style={{
                        backgroundColor:
                            theme === 'dark'
                                ? palette.overlayInvertedBackground
                                : palette.overlayPrimaryBackground,
                    }}
                    onChange={setModeOfPayment}
                    placeholder="Select mode of payment"
                />
                <Button
                    text="Save"
                    onPress={handleAdd}
                    style={styles.saveBtn}
                    textStyle={styles.saveBtnText as any}
                    disabled={isLoading}
                    loading={isLoading}
                    showText={!isLoading}
                    loadingColor={palette.primaryAccent}
                />
            </View>
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: palette.primaryAccent,
        },
        text: {
            color: palette.invertedText,
        },
        forms: {
            marginTop: 32,
            gap: 16,
            paddingHorizontal: 16,
        },
        saveBtn: {
            marginTop: 32,
            backgroundColor: palette.primaryBackground,
        },
        saveBtnText: {
            color: palette.primaryAccent,
        },
    });

export default New;
