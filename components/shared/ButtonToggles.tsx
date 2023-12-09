import { PressableProps, View, Pressable, StyleSheet } from 'react-native';
import Text from './Text';
import {
    AnimateProps,
    Easing,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { ReactNode, useState } from 'react';
import Reanimated from 'react-native-reanimated';
import { Colors, SearchCategory } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface ButtonTogglesProps {
    categories: {
        title: string;
        onPress: () => void;
    }[];
    toggledCategory: SearchCategory;
    setToggledCategory: (category: SearchCategory) => void;
}

interface ToggleButtonProps extends AnimateProps<PressableProps> {
    toggled?: boolean;
}

const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const ToggleButton = ({ toggled, children, onPress }: ToggleButtonProps) => {
    const { palette } = useTheme();
    const styles = toggleButtonStyles(palette);
    const scaleProgress = useSharedValue(1);
    const toggleProgress = useDerivedValue(
        () =>
            toggled
                ? withTiming(1, {
                      duration: 250,
                  })
                : withTiming(0, {
                      duration: 250,
                  }),
        [toggled]
    );

    const onPressIn = () => {
        scaleProgress.value = 0.9;
    };

    const onPressOut = () => {
        scaleProgress.value = 1;
    };

    const animatedButton = useAnimatedStyle(() => ({
        transform: [
            {
                scale: withTiming(scaleProgress.value, {
                    duration: 1000,
                    easing: Easing.out(Easing.exp),
                }),
            },
        ],
    }));

    const animatedText = useAnimatedStyle(() => ({
        color: interpolateColor(
            toggleProgress.value,
            [0, 1],
            [palette.primaryAccent, palette.invertedText]
        ),
    }));

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[styles.button, animatedButton]}
        >
            <Text style={[styles.text, animatedText]}>{children as ReactNode}</Text>
        </AnimatedPressable>
    );
};

const ButtonToggles = ({ categories, toggledCategory, setToggledCategory }: ButtonTogglesProps) => {
    const { palette } = useTheme();
    const styles = buttonTogglesStyles(palette);
    const [width, setWidth] = useState(0);
    const toggleProgress = useDerivedValue(
        () =>
            toggledCategory.title === 'Reservations'
                ? withSpring(1, {
                      mass: 0.5,
                      damping: 16,
                      stiffness: 120,
                      overshootClamping: false,
                      restDisplacementThreshold: 0.01,
                      restSpeedThreshold: 2,
                  })
                : withSpring(0, {
                      mass: 0.5,
                      damping: 16,
                      stiffness: 120,
                      overshootClamping: false,
                      restDisplacementThreshold: 0.01,
                      restSpeedThreshold: 2,
                  }),
        [toggledCategory, toggledCategory.title]
    );

    const animatedIndicator = useAnimatedStyle(
        () => ({
            transform: [
                {
                    translateX: interpolate(toggleProgress.value, [1, 0], [0, width / 2]),
                },
            ],
        }),
        [toggleProgress.value, toggleProgress, toggledCategory, toggledCategory.title]
    );

    return (
        <View style={styles.container}>
            <View
                style={styles.buttonContainer}
                onLayout={e => setWidth(e.nativeEvent.layout.width)}
            >
                {categories.map(category => (
                    <ToggleButton
                        toggled={toggledCategory.title === category.title}
                        onPress={() => setToggledCategory(category)}
                        key={category.title}
                    >
                        {category.title}
                    </ToggleButton>
                ))}
            </View>
            <Reanimated.View style={[styles.indicator, animatedIndicator]}></Reanimated.View>
        </View>
    );
};

const toggleButtonStyles = (palette: Colors) =>
    StyleSheet.create({
        button: {
            flex: 1,
            padding: 12,
            borderRadius: 8,
            zIndex: 1,
        },
        text: {
            textAlign: 'center',
        },
    });

const buttonTogglesStyles = (palette: Colors) =>
    StyleSheet.create({
        container: {
            position: 'relative',
            backgroundColor: palette.secondaryAccent,
            borderRadius: 8,
        },
        buttonContainer: {
            flexDirection: 'row',
            gap: 4,
            width: '100%',
            padding: 4,
            zIndex: 2,
        },
        indicator: {
            position: 'absolute',
            width: '50%',
            height: '100%',
            backgroundColor: palette.primaryAccent,
            borderRadius: 8,
            zIndex: 1,
        },
    });

export default ButtonToggles;
