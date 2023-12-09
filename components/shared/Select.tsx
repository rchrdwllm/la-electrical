import {
    View,
    Pressable,
    StyleSheet,
    StyleProp,
    ViewStyle,
    Platform,
    TextStyle,
    PressableProps,
} from 'react-native';
import { Colors } from '../../types';
import Reanimated, {
    Easing,
    Extrapolate,
    interpolate,
    measure,
    runOnUI,
    useAnimatedRef,
    useAnimatedStyle,
    useDerivedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { FlatList } from 'react-native-gesture-handler';
import Text from '../shared/Text';
import Button from './Button';
import ChevronDownIcon from '../../assets/icons/chevron-down-icon.svg';
import { useTheme } from '../../hooks/useTheme';
import { useSharedValue } from 'react-native-reanimated';
import { useState } from 'react';

interface SelectProps extends PressableProps {
    data: string[];
    style?: StyleProp<ViewStyle>;
    selectedItem?: string;
    textStyle?: StyleProp<TextStyle>;
    onChange: (item: string) => void;
    placeholder?: string;
    iconColor?: string;
    linesToShow?: number;
}

const Select = ({
    data,
    style,
    selectedItem,
    onChange,
    iconColor,
    placeholder = 'Select',
    textStyle,
    linesToShow,
    onLayout,
}: SelectProps) => {
    const { theme, palette } = useTheme();
    const styles = styling(palette);
    const [selected, setSelected] = useState<null | string>(selectedItem ?? null);

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

    const animatedScale = useAnimatedStyle(
        () => ({
            transform: [
                {
                    scale: withTiming(scaleProgress.value, {
                        duration: 1000,
                        easing: Easing.out(Easing.exp),
                    }),
                },
            ],
            paddingBottom: interpolate(
                heightProgress.value,
                [0, 1],
                [Platform.OS === 'ios' ? 12 : 15, 0]
            ),
        }),
        [Platform.OS]
    );

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

    const handleChange = (item: string) => {
        handleAnimate();
        onChange(item);
        setSelected(item);
    };

    return (
        <Pressable onPress={handleAnimate} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Reanimated.View onLayout={onLayout} style={[styles.container, animatedScale, style]}>
                <View style={styles.flexContainer}>
                    <Text
                        style={[
                            {
                                color: palette.invertedText,
                            },
                            textStyle,
                        ]}
                    >
                        {selected ? selected : placeholder}
                    </Text>
                    <Reanimated.View style={animatedRotate}>
                        <ChevronDownIcon
                            height={20}
                            width={20}
                            stroke={iconColor ?? palette.invertedText}
                        />
                    </Reanimated.View>
                </View>
                <Reanimated.View style={[styles.dropdownContainer, animatedHeight]}>
                    <Reanimated.View ref={dropdownRef} style={[styles.dropdown, animatedOpacity]}>
                        <FlatList
                            style={{
                                maxHeight: linesToShow ? linesToShow * 44 : 200,
                            }}
                            data={data}
                            renderItem={({ item }) => (
                                <Button
                                    text={item}
                                    key={item}
                                    textStyle={[
                                        {
                                            textAlign: 'left',
                                            opacity: 0.75,
                                        } as any,
                                        textStyle,
                                    ]}
                                    style={{
                                        paddingHorizontal: 0,
                                        backgroundColor: 'transparent',
                                    }}
                                    onPress={() => handleChange(item)}
                                />
                            )}
                            keyExtractor={item => item}
                        />
                    </Reanimated.View>
                </Reanimated.View>
            </Reanimated.View>
        </Pressable>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            overflow: 'hidden',
            paddingHorizontal: 10,
            paddingVertical: Platform.OS === 'ios' ? 12 : 15,
            borderRadius: 10,
            backgroundColor: palette.secondaryAccent,
        },
        flexContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        reservationDetails: {
            gap: 4,
        },
        reservationCustomer: {
            color: palette.secondaryText,
        },
        dropdownContainer: {
            width: '100%',
        },
        dropdown: {
            paddingTop: 8,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            flex: 1,
            width: '100%',
        },
    });

export default Select;
