import { TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native';
import Reanimated, { AnimateProps } from 'react-native-reanimated';
import { forwardRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useFonts, Lexend_300Light } from '@expo-google-fonts/lexend';

interface TextInputProps extends AnimateProps<RNTextInputProps> {
    style?: {};
}

const AnimatedTextInput = Reanimated.createAnimatedComponent(RNTextInput);

const TextInput = forwardRef((props: TextInputProps, ref) => {
    const { palette } = useTheme();
    let [fontsLoaded, fontError] = useFonts({
        Lexend_300Light,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <AnimatedTextInput
            ref={ref as any}
            style={[
                {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor: palette.secondaryAccent,
                    color: palette.primaryText,
                    fontFamily: 'Lexend_300Light',
                },
                props.style,
            ]}
            cursorColor={palette.primaryAccent}
            selectionColor={palette.primaryAccent}
            placeholderTextColor={props.placeholderTextColor ?? palette.secondaryText}
            autoCapitalize="none"
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder={props.placeholder}
            secureTextEntry={props.secureTextEntry}
            layout={props.layout}
            onFocus={props.onFocus}
            autoFocus={props.autoFocus}
        />
    );
});

export default TextInput;
