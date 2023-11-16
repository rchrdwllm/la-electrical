import {
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    ViewStyle,
    ActivityIndicator,
    Animated,
    View,
    Platform,
} from 'react-native';
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
            iconSize = 16,
            iconColor,
        }: ButtonProps,
        _
    ) => {
        const animatedScale = useRef(new Animated.Value(1)).current;
        const animatedOpacity = useRef(new Animated.Value(1)).current;
        const { palette } = useTheme();
        const styles = styling();

        const onPressIn = () => {
            Animated.timing(animatedScale, {
                duration: 100,
                toValue: 0.97,
                useNativeDriver: true,
            }).start();
        };

        const onPressOut = () => {
            Animated.timing(animatedScale, {
                duration: 100,
                toValue: 1,
                useNativeDriver: true,
            }).start();
        };

        const handleOpacityChange = () => {
            if (disabled) {
                Animated.timing(animatedOpacity, {
                    duration: 200,
                    toValue: 0.5,
                    useNativeDriver: true,
                }).start();
            } else {
                Animated.timing(animatedOpacity, {
                    duration: 200,
                    toValue: 1,
                    useNativeDriver: true,
                }).start();
            }
        };

        useEffect(() => {
            handleOpacityChange();
        }, [disabled]);

        return (
            <AnimatedPressable
                style={[
                    styles.container,
                    style as StyleProp<ViewStyle>,
                    {
                        transform: [
                            {
                                scale: animatedScale,
                            },
                        ],
                    },
                    {
                        opacity: animatedOpacity,
                        pointerEvents: disabled ? 'none' : 'auto',
                        backgroundColor:
                            variant === 'secondary'
                                ? palette.secondaryAccent
                                : palette.primaryAccent,
                    },
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
                {showText ? (
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
        },
        text: {
            textAlign: 'center',
            width: '100%',
        },
    });

export default Button;
