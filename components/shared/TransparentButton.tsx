import { View, Pressable, StyleSheet, PressableProps, StyleProp } from 'react-native';
import Reanimated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Text from './Text';
import { Colors } from '../../types';
import { forwardRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface TransparentButtonProps extends PressableProps {
    Icon?: any;
    alignment?: 'left' | 'center' | 'right';
    textStyle?: StyleProp<Text>;
    iconSize?: number;
    iconColor?: string;
    textShown?: boolean;
}

const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const TransparentButton = forwardRef(
    (
        {
            Icon,
            children,
            alignment = 'center',
            style,
            textStyle,
            iconSize = 16,
            iconColor,
            onPress,
            textShown = true,
        }: TransparentButtonProps,
        _
    ) => {
        const { palette } = useTheme();
        const styles = styling(palette);
        const scaleProgress = useSharedValue(1);

        const onPressIn = () => {
            scaleProgress.value = 0.95;
        };

        const onPressOut = () => {
            scaleProgress.value = 1;
        };

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

        return (
            <AnimatedPressable
                style={
                    [
                        styles.container,
                        {
                            justifyContent:
                                alignment === 'left'
                                    ? 'flex-start'
                                    : alignment === 'right'
                                    ? 'flex-end'
                                    : 'center',
                        },
                        animatedScale,
                        style,
                    ] as any
                }
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                {Icon ? (
                    <View>
                        <Icon
                            stroke={iconColor ?? palette.invertedOnAccent}
                            height={iconSize}
                            width={iconSize}
                        />
                    </View>
                ) : null}
                {textShown && (
                    <Text style={[styles.text, textStyle] as any}>{children as any}</Text>
                )}
            </AnimatedPressable>
        );
    }
);

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            backgroundColor: palette.overlayPrimaryBackground,
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderRadius: 8,
            gap: 8,
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        text: {
            color: palette.invertedOnAccent,
        },
    });

export default TransparentButton;
