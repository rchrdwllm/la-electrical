import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import React, { Dispatch, SetStateAction, memo, useEffect, useState } from 'react';
import Text from './Text';
import Reanimated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { useReservationsStore } from '../../zustand/store';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import TextInput from './TextInput';
import Button from './Button';
import Select from './Select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { updateReservation } from '../../utils/reservations';
import { Timestamp } from 'firebase/firestore';

interface EditReservationProps {
    setReservationToEdit: Dispatch<SetStateAction<string | null>>;
    reservationToEdit: string;
}

const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const EditReservation = ({ setReservationToEdit, reservationToEdit }: EditReservationProps) => {
    const { palette } = useTheme();
    const styles = styling(palette);
    const { reservationById } = useReservationsStore();
    const reservation = reservationById(reservationToEdit);
    const offset = useSharedValue(0);
    const { height } = useWindowDimensions();
    const [isLoading, setIsLoading] = useState(false);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [name, setName] = useState(reservation.name);
    const [reservationDate, setReservationDate] = useState<Date | null>(
        reservation.reservationDate.toDate()
    );
    const [typeOfService, setTypeOfService] = useState(reservation.typeOfService);
    const [modeOfPayment, setModeOfPayment] = useState(reservation.modeOfPayment);
    const [noChanges, setNoChanges] = useState(true);

    useEffect(() => {
        if (
            name !== reservation.name ||
            reservationDate?.getTime() !== reservation.reservationDate.toDate().getTime() ||
            typeOfService !== reservation.typeOfService ||
            modeOfPayment !== reservation.modeOfPayment
        ) {
            setNoChanges(false);
        } else {
            setNoChanges(true);
        }
    }, [name, reservationDate, typeOfService, modeOfPayment]);

    const toggleModal = () => {
        setReservationToEdit(null);

        offset.value = 0;
    };

    const pan = Gesture.Pan()
        .onChange(e => {
            offset.value += e.changeY;
        })
        .onFinalize(() => {
            if (offset.value < height / 3) {
                offset.value = withSpring(0, {
                    mass: 1,
                    damping: 20,
                    stiffness: 175,
                    overshootClamping: false,
                    restDisplacementThreshold: 0.01,
                    restSpeedThreshold: 2,
                });
            } else {
                runOnJS(toggleModal)();

                offset.value = withSpring(height);
            }
        });

    const animatedY = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: offset.value,
            },
        ],
    }));

    const services = [
        'Alternator repair',
        'Battery replacement',
        'Brake pads replacement',
        'Brake rotor replacement',
        'Car battery replacement',
        'Car door mirror replacement',
    ];
    const modesOfPayment = ['Cash', 'GCash'];

    const handleConfirm = (date: Date) => {
        setReservationDate(date);
        setIsDatePickerVisible(false);
    };

    const handleDateCancel = () => {
        setIsDatePickerVisible(false);
    };

    const handleCancel = () => {
        setReservationToEdit(null);
    };

    const handleSave = async () => {
        setIsLoading(true);

        await updateReservation(reservationToEdit, {
            name,
            reservationDate: Timestamp.fromDate(reservationDate!),
            typeOfService,
            modeOfPayment,
        });

        setIsLoading(false);
        setReservationToEdit(null);
    };

    return (
        <View style={styles.modalContainer}>
            <StatusBar animated style="light" />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                date={reservationDate || new Date()}
                onConfirm={handleConfirm}
                onCancel={handleDateCancel}
                display="inline"
                accentColor={palette.primaryAccent}
                buttonTextColorIOS={palette.primaryAccent}
            />
            <AnimatedPressable
                entering={FadeIn}
                exiting={FadeOut}
                onPress={() => setReservationToEdit(null)}
                style={styles.modalOverlay}
            ></AnimatedPressable>
            <GestureDetector gesture={pan}>
                <Reanimated.View
                    entering={SlideInDown.springify()
                        .damping(20)
                        .mass(1)
                        .stiffness(175)
                        .restDisplacementThreshold(0.01)
                        .restSpeedThreshold(2)
                        .overshootClamping(0)}
                    exiting={SlideOutDown}
                    style={[styles.modal, animatedY]}
                >
                    <View style={styles.pill} />
                    <Text fontWeight="bold" style={styles.heading}>
                        Edit reservation
                    </Text>
                    <View style={styles.forms}>
                        <TextInput placeholder="Name" value={name} onChangeText={setName} />
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
                                backgroundColor: palette.secondaryAccent,
                            }}
                            textStyle={[
                                { textAlign: 'left' } as any,
                                {
                                    color: palette.primaryText,
                                },
                            ]}
                            onPress={() => setIsDatePickerVisible(true)}
                        />
                        <Select
                            data={services}
                            selectedItem={typeOfService}
                            textStyle={{
                                opacity: 1,
                                color: palette.primaryText,
                            }}
                            onChange={setTypeOfService}
                            placeholder="Select a service"
                            iconColor={palette.primaryText}
                            linesToShow={3}
                        />
                        <Select
                            data={modesOfPayment}
                            selectedItem={modeOfPayment}
                            textStyle={{
                                opacity: 1,
                                color: palette.primaryText,
                            }}
                            onChange={setModeOfPayment}
                            placeholder="Select mode of payment"
                            iconColor={palette.primaryText}
                        />
                        <View style={styles.btns}>
                            <Button
                                text="Cancel"
                                onPress={handleCancel}
                                style={styles.cancelBtn}
                                textStyle={styles.cancelBtnText as any}
                            />
                            <Button
                                text="Save"
                                onPress={handleSave}
                                textStyle={styles.saveBtnText as any}
                                disabled={isLoading || noChanges}
                                loading={isLoading}
                                showText={!isLoading}
                            />
                        </View>
                    </View>
                </Reanimated.View>
            </GestureDetector>
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        modalContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            flex: 1,
            zIndex: 3,
        },
        modalOverlay: {
            width: '100%',
            height: '100%',
            flex: 1,
            backgroundColor: '#00000050',
        },
        modal: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '93%',
            backgroundColor: palette.primaryBackground,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
            alignItems: 'center',
            gap: 32,
        },
        pill: {
            height: 6,
            width: 64,
            borderRadius: 3,
            backgroundColor: palette.secondaryText,
            opacity: 0.2,
        },
        heading: {
            fontSize: 24,
        },
        forms: {
            width: '100%',
            gap: 16,
        },
        btns: {
            marginTop: 32,
            backgroundColor: palette.primaryBackground,
            gap: 16,
        },
        cancelBtn: {
            backgroundColor: palette.secondaryAccent,
        },
        cancelBtnText: {
            color: palette.primaryAccent,
        },
        saveBtnText: {
            color: palette.invertedText,
        },
    });

export default memo(EditReservation);
