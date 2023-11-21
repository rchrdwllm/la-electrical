import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import Reanimated, { FadeIn, FadeOut } from 'react-native-reanimated';
import InboxIcon from '../../assets/icons/inbox-icon.svg';
import Text from './Text';
import { Colors } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface ListEmptyProps {
    text?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const ListEmpty = ({ text = "There's nothing here!", style, textStyle }: ListEmptyProps) => {
    const { palette } = useTheme();
    const styles = styling(palette);

    return (
        <Reanimated.View style={[styles.container, style]} entering={FadeIn} exiting={FadeOut}>
            <InboxIcon height={48} width={48} stroke={palette.secondaryText} />
            <Text style={[styles.text, textStyle]}>{text}</Text>
        </Reanimated.View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            paddingVertical: 48,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
        },
        text: {
            color: palette.secondaryText,
        },
    });

export default ListEmpty;
