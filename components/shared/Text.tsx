import { TextProps as RNTextProps, TextStyle, StyleProp } from 'react-native';
import Reanimated, { AnimateProps } from 'react-native-reanimated';
import {
    useFonts,
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import { useTheme } from '../../hooks/useTheme';
import { forwardRef } from 'react';

interface TextProps extends RNTextProps {
    variant?: 'primaryText' | 'secondaryText';
    fontWeight?: 'regular' | 'medium' | 'bold';
    style?: StyleProp<TextStyle> | StyleProp<TextStyle>[];
}

const Text = forwardRef(
    ({ children, variant, fontWeight, style, numberOfLines }: TextProps, ref) => {
        let [fontsLoaded, fontError] = useFonts({
            Lexend_300Light,
            Lexend_400Regular,
            Lexend_700Bold,
        });
        const { palette } = useTheme();

        if (!fontsLoaded && !fontError) {
            return null;
        }

        return (
            <Reanimated.Text
                style={[
                    {
                        color: palette[variant ?? 'primaryText'],
                        fontFamily:
                            fontWeight === 'medium'
                                ? 'Lexend_400Regular'
                                : fontWeight === 'bold'
                                ? 'Lexend_700Bold'
                                : 'Lexend_300Light',
                    },
                    style,
                ]}
                numberOfLines={numberOfLines}
            >
                {children}
            </Reanimated.Text>
        );
    }
);

(Text as any).Reanimated = ({ variant, fontWeight, style, children }: AnimateProps<TextProps>) => {
    const { palette } = useTheme() ?? 'light';
    let [fontsLoaded, fontError] = useFonts({
        Lexend_300Light,
        Lexend_400Regular,
        Lexend_700Bold,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <Reanimated.Text
            style={[
                {
                    color: palette[(variant as 'primaryText' | 'secondaryText') ?? 'primaryText'],
                    fontFamily:
                        fontWeight === 'medium'
                            ? 'Lexend_400Regular'
                            : fontWeight === 'bold'
                            ? 'Lexend_700Bold'
                            : 'Lexend_300Light',
                },
                style,
            ]}
        >
            {children}
        </Reanimated.Text>
    );
};

export default Text;
