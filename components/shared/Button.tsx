import {
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    ViewStyle,
    ActivityIndicator,
    View,
    Platform,
} from 'react-native';
import Reanimated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Text from './Text';
import { ReactNode, forwardRef, useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface ButtonProps extends PressableProps {
    variant?: 'primary' | 'secondary';
    textStyle?: StyleProp<Text>;
    text?: string;
    showText?: boolean;
    loading?: boolean;
    disabled?: boolean;
    Icon?: any;
    iconSize?: number;
    iconColor?: string;
}

const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const Button = forwardRef(
    (
        {
            children,
            onPress,
            variant = 'primary',
            style,
            textStyle,
            text,
            showText = true,
            loading,
            disabled,
            Icon,
            iconSize = 15,
            iconColor,
        }: ButtonProps,
        _
    ) => {
        const scaleProgress = useSharedValue(1);
        const opacityProgress = useSharedValue(1);
        const { palette } = useTheme();
        const styles = styling();

        const onPressIn = () => {
            scaleProgress.value = 0.95;
        };

        const onPressOut = () => {
            scaleProgress.value = 1;
        };

        const handleOpacityChange = () => {
            if (disabled) {
                opacityProgress.value = 0.5;
            } else {
                opacityProgress.value = 1;
            }
        };

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [
                {
                    scale: withTiming(scaleProgress.value, {
                        duration: 1000,
                        easing: Easing.out(Easing.exp),
                    }),
                },
            ],
            opacity: withTiming(opacityProgress.value, {
                duration: 10,
                easing: Easing.out(Easing.exp),
            }),
        }));

        useEffect(() => {
            handleOpacityChange();
        }, [disabled]);

        return (
            <AnimatedPressable
                style={[
                    styles.container,
                    animatedStyle,
                    {
                        pointerEvents: disabled ? 'none' : 'auto',
                        backgroundColor:
                            variant === 'secondary'
                                ? palette.secondaryAccent
                                : palette.primaryAccent,
                    },
                    style as StyleProp<ViewStyle>,
                ]}
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                {Icon ? (
                    <Icon
                        height={iconSize}
                        width={iconSize}
                        stroke={iconColor ?? palette.invertedOnAccent}
                    />
                ) : null}
                {text && showText ? (
                    <Text
                        style={
                            [
                                styles.text,
                                {
                                    color:
                                        variant === 'secondary'
                                            ? palette.primaryAccent
                                            : palette.invertedText,
                                },
                                textStyle as any,
                            ] as any
                        }
                    >
                        {text}
                    </Text>
                ) : null}
                {loading ? (
                    <View
                        style={{
                            height: Platform.OS === 'ios' ? 18 : 19,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <ActivityIndicator color={palette.invertedText} size={14} />
                    </View>
                ) : null}
                {children as ReactNode}
            </AnimatedPressable>
        );
    }
);

const styling = () =>
    StyleSheet.create({
        container: {
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
        text: {
            textAlign: 'center',
            width: '100%',
        },
    });

export default Button;
