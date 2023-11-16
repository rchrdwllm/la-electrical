import { View, Pressable, StyleSheet, Animated, PressableProps, StyleProp } from 'react-native';
import Text from './Text';
import { Colors } from '../../types';
import { useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface TransparentButtonProps extends PressableProps {
    Icon?: any;
    alignment?: 'left' | 'center' | 'right';
    textStyle?: StyleProp<Text>;
    iconSize?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TransparentButton = ({
    Icon,
    children,
    alignment = 'center',
    style,
    textStyle,
    iconSize = 16,
    onPress,
}: TransparentButtonProps) => {
    const { palette } = useTheme();
    const styles = styling(palette);
    const animatedScale = useRef(new Animated.Value(1)).current;

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
                        transform: [
                            {
                                scale: animatedScale,
                            },
                        ],
                    },
                    style,
                ] as any
            }
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            {Icon ? (
                <View>
                    <Icon stroke={palette.invertedOnAccent} height={iconSize} width={iconSize} />
                </View>
            ) : null}
            <Text style={[styles.text, textStyle] as any}>{children as any}</Text>
        </AnimatedPressable>
    );
};

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
