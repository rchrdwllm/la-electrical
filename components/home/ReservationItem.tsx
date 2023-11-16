import { View, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../types';
import Reanimated, {
    Extrapolate,
    interpolate,
    measure,
    runOnUI,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedStyle,
    useDerivedValue,
    withSpring,
} from 'react-native-reanimated';
import ChevronDownIcon from '../../assets/icons/chevron-down-icon.svg';
import Text from '../shared/Text';
import { useTheme } from '../../hooks/useTheme';
import { useSharedValue } from 'react-native-reanimated';
import Button from '../shared/Button';

const ReservationItem = () => {
    const { theme, palette } = useTheme();
    const styles = styling(palette);
    const dropdownRef = useAnimatedRef<Reanimated.View>();
    const heightValue = useSharedValue(0);
    const isToggled = useSharedValue(false);
    const progress = useDerivedValue(
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

    const animatedRotate = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: `${progress.value * -180}deg`,
            },
        ],
    }));

    const animatedHeight = useAnimatedStyle(() => ({
        height: interpolate(progress.value, [0, 1], [0, heightValue.value], Extrapolate.EXTEND),
    }));

    const animatedOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolate.CLAMP),
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
                        <Button variant="secondary" style={styles.dropdownBtn} text="Delete" />
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
            flexDirection: 'row',
            flex: 1,
            width: '100%',
            gap: 8,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        dropdownBtn: {
            flex: 1,
        },
    });

export default ReservationItem;
