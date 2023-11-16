import { View, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../types';
import Reanimated, {
    Easing,
    Extrapolate,
    interpolate,
    interpolateColor,
    measure,
    runOnUI,
    useAnimatedReaction,
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
import { useTheme } from '../../hooks/useTheme';
import { useSharedValue } from 'react-native-reanimated';
import { useState } from 'react';

const ReservationItem = () => {
    const { theme, palette } = useTheme();
    const styles = styling(palette);
    const [isPaid, setIsPaid] = useState(false);

    const dropdownRef = useAnimatedRef<Reanimated.View>();
    const heightValue = useSharedValue(0);
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
            isPaid
                ? withTiming(1, {
                      duration: 250,
                      easing: Easing.out(Easing.exp),
                  })
                : withTiming(0, {
                      duration: 250,
                      easing: Easing.in(Easing.exp),
                  }),
        [isPaid]
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

    const handleAnimate = () => {
        if (heightValue.value === 0) {
            runOnUI(() => {
                'worklet';

                heightValue.value = measure(dropdownRef).height;
            })();
        }

        isToggled.value = !isToggled.value;
    };

    return (
        <Pressable onPress={handleAnimate}>
            <Reanimated.View style={styles.container}>
                <View style={styles.flexContainer}>
                    <View style={styles.reservationDetails}>
                        <Text fontWeight="medium">Alternator repair</Text>
                        <Text style={styles.reservationCustomer}>Richard William Flores</Text>
                    </View>
                    <Reanimated.View style={animatedRotate}>
                        <ChevronDownIcon height={20} width={20} stroke={palette.primaryText} />
                    </Reanimated.View>
                </View>
                <Reanimated.View style={[styles.dropdownContainer, animatedHeight]}>
                    <Reanimated.View ref={dropdownRef} style={[styles.dropdown, animatedOpacity]}>
                        <Button style={styles.dropdownBtn} text="Edit" />
                        <Button style={styles.dropdownBtn} text="Delete" />
                        <Button
                            onPress={() => setIsPaid(!isPaid)}
                            style={[styles.dropdownBtn, animatedColors]}
                            Icon={CheckIcon}
                            iconColor={isPaid ? palette.primaryAccent : palette.invertedText}
                        />
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
            paddingBottom: 16,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            gap: 8,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        dropdownBtn: {
            flex: 1,
            height: '100%',
        },
    });

export default ReservationItem;
