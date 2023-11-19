import { View, StyleSheet } from 'react-native';
import Text from '../shared/Text';
import { Colors } from '../../types';
import { useTheme } from '../../hooks/useTheme';

const SectionHeader = ({ title }: { title: string }) => {
    const { palette } = useTheme();
    const styles = styling(palette);

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text>{title}</Text>
            </View>
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            width: '100%',
            position: 'relative',
        },
        textContainer: {
            position: 'absolute',
            top: 0,
            left: -16,
            backgroundColor: palette.primaryBackground,
            paddingLeft: 16,
        },
    });

export default SectionHeader;
