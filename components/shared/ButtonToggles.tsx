import { PressableProps, View, Pressable, StyleSheet } from 'react-native';
import Text from './Text';
import {
    AnimateProps,
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { ReactNode, useEffect, useState } from 'react';
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
        scaleProgress.value = 0.95;
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
        backgroundColor: interpolateColor(
            toggleProgress.value,
            [0, 1],
            [palette.secondaryAccent, palette.primaryAccent]
        ),
    }));

    const animatedText = useAnimatedStyle(() => ({
        color: interpolateColor(
            toggleProgress.value,
            [0, 1],
            [palette.secondaryText, palette.invertedText]
        ),
    }));

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[styles.container, animatedButton]}
        >
            <Text style={[styles.text, animatedText]}>{children as ReactNode}</Text>
        </AnimatedPressable>
    );
};

const ButtonToggles = ({ categories, toggledCategory, setToggledCategory }: ButtonTogglesProps) => {
    const { palette } = useTheme();
    const styles = buttonTogglesStyles(palette);

    return (
        <View style={styles.container}>
            {categories.map(category => (
                <ToggleButton
                    toggled={toggledCategory.title === category.title}
                    onPress={() => setToggledCategory(category)}
                >
                    {category.title}
                </ToggleButton>
            ))}
        </View>
    );
};

const toggleButtonStyles = (palette: Colors) =>
    StyleSheet.create({
        container: {
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: palette.primaryAccent,
        },
        text: {
            textAlign: 'center',
            width: '100%',
            color: palette.invertedText,
        },
    });

const buttonTogglesStyles = (palette: Colors) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            gap: 16,
        },
    });

export default ButtonToggles;
