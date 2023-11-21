import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { Colors } from '../../types';
import Reanimated, {
    Easing,
    Extrapolate,
    interpolate,
    interpolateColor,
    measure,
    runOnUI,
    useAnimatedRef,
    useAnimatedStyle,
    useDerivedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import ChevronDownIcon from '../../assets/icons/chevron-down-icon.svg';
import CheckIcon from '../../assets/icons/check-icon.svg';
import Text from '../shared/Text';
import Button from '../shared/Button';
import { Reservation } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { useSharedValue } from 'react-native-reanimated';
import { useState } from 'react';
import { deleteReservation } from '../../utils/reservations';

const ReservationItem = ({
    reservationDate,
    name,
    typeOfService,
    isPaid,
    price,
    id,
}: Reservation) => {
    const { theme, palette } = useTheme();
    const styles = styling(palette);
    const [paid, setPaid] = useState(isPaid);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const dropdownRef = useAnimatedRef<Reanimated.View>();
    const heightValue = useSharedValue(0);
    const scaleProgress = useSharedValue(1);
    const isToggled = useSharedValue(false);
    const heightProgress = useDerivedValue(
        () =>
            isToggled.value
                ? withSpring(1, {
                      mass: 1,
                      damping: 14,
                      stiffness: 150,
                      overshootClamping: false,
                      restDisplacementThreshold: 0.01,
                      restSpeedThreshold: 2,
                  })
                : withSpring(0, {
                      mass: 1,
                      damping: 14,
                      stiffness: 150,
                      overshootClamping: false,
                      restDisplacementThreshold: 0.01,
                      restSpeedThreshold: 2,
                  }),
        [theme]
    );
    const colorProgress = useDerivedValue(
        () =>
            paid
                ? withTiming(1, {
                      duration: 250,
                      easing: Easing.out(Easing.exp),
                  })
                : withTiming(0, {
                      duration: 250,
                      easing: Easing.in(Easing.exp),
                  }),
        [paid]
    );

    const animatedRotate = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: `${heightProgress.value * -180}deg`,
            },
        ],
    }));

    const animatedHeight = useAnimatedStyle(() => ({
        height: interpolate(
            heightProgress.value,
            [0, 1],
            [0, heightValue.value],
            Extrapolate.EXTEND
        ),
    }));

    const animatedOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(heightProgress.value, [0, 1], [0, 1], Extrapolate.CLAMP),
    }));

    const animatedColors = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            colorProgress.value,
            [0, 1],
            [palette.primaryAccent, palette.secondaryAccent]
        ),
    }));

    const animatedScale = useAnimatedStyle(() => ({
        transform: [
            {
                scale: withTiming(scaleProgress.value, {
                    duration: 1000,
                    easing: Easing.out(Easing.exp),
                }),
            },
        ],
    }));

    const handleAnimate = () => {
        if (heightValue.value === 0) {
            runOnUI(() => {
                'worklet';

                heightValue.value = measure(dropdownRef).height;
            })();
        }

        isToggled.value = !isToggled.value;
    };

    const onPressIn = () => {
        scaleProgress.value = 0.95;
    };

    const onPressOut = () => {
        scaleProgress.value = 1;
    };

    const handleDelete = () => {
        setDeleteLoading(true);

        Alert.alert('Delete reservation', 'Are you sure you want to delete this reservation?', [
            {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => setDeleteLoading(false),
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await deleteReservation(id);

                    setDeleteLoading(false);
                },
            },
        ]);
    };

    return (
        <Pressable onPress={handleAnimate} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Reanimated.View style={[styles.container, animatedScale]}>
                <View style={styles.flexContainer}>
                    <View style={styles.reservationDetails}>
                        <Text fontWeight="medium">{typeOfService}</Text>
                        <Text style={styles.reservationCustomer}>{name}</Text>
                    </View>
                    <Reanimated.View style={animatedRotate}>
                        <ChevronDownIcon height={20} width={20} stroke={palette.primaryText} />
                    </Reanimated.View>
                </View>
                <Reanimated.View style={[styles.dropdownContainer, animatedHeight]}>
                    <Reanimated.View ref={dropdownRef} style={[styles.dropdown, animatedOpacity]}>
                        <View style={styles.details}>
                            <Text style={styles.date}>
                                {`${Intl.DateTimeFormat(navigator.language, {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric',
                                }).format(reservationDate.toDate())} ${Intl.DateTimeFormat('en', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                }).format(new Date(reservationDate.toDate()))}`}
                            </Text>
                            <Text
                                fontWeight="medium"
                                style={{
                                    color: paid ? palette.success : palette.warning,
                                }}
                            >
                                PHP {price}
                            </Text>
                        </View>
                        <View style={styles.dropdownBtns}>
                            <Button style={styles.dropdownBtn} text="Edit" />
                            <Button
                                style={styles.dropdownBtn}
                                onPress={handleDelete}
                                text="Delete"
                                loading={deleteLoading}
                                showText={!deleteLoading}
                            />
                            <Button
                                onPress={() => setPaid(!paid)}
                                style={[styles.dropdownBtn, animatedColors]}
                                Icon={CheckIcon}
                                iconSize={19}
                                iconColor={paid ? palette.primaryAccent : palette.invertedText}
                            />
                        </View>
                    </Reanimated.View>
                </Reanimated.View>
                <Reanimated.View style={styles.separator}></Reanimated.View>
            </Reanimated.View>
        </Pressable>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            overflow: 'hidden',
        },
        flexContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
        },
        reservationDetails: {
            gap: 4,
        },
        reservationCustomer: {
            color: palette.secondaryText,
        },
        separator: {
            height: 1,
            backgroundColor: palette.primaryBorder,
            marginHorizontal: 16,
        },
        dropdownContainer: {
            width: '100%',
        },
        dropdown: {
            paddingHorizontal: 16,
            paddingBottom: 8,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            flex: 1,
            width: '100%',
        },
        details: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        date: {
            color: palette.secondaryText,
        },
        dropdownBtns: {
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            marginBottom: 8,
        },
        dropdownBtn: {
            flex: 1,
        },
    });

export default ReservationItem;
