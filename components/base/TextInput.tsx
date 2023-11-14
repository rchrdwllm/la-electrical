import { TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native';
import { forwardRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useFonts, Lexend_300Light } from '@expo-google-fonts/lexend';

interface TextInputProps extends RNTextInputProps {
    style?: {};
}

const TextInput = forwardRef((props: TextInputProps, ref) => {
    const { palette } = useTheme();
    let [fontsLoaded, fontError] = useFonts({
        Lexend_300Light,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <RNTextInput
            ref={ref as any}
            style={[
                props.style,
                {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor: palette.secondaryAccent,
                    color: palette.primaryText,
                    fontFamily: 'Lexend_300Light',
                },
            ]}
            cursorColor={palette.primaryAccent}
            placeholderTextColor={palette.secondaryText}
            autoCapitalize="none"
            {...props}
        />
    );
});

export default TextInput;
