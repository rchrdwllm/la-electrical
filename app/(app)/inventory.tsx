import { View, StyleSheet } from 'react-native';
import Text from '../../components/shared/Text';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../types';

const Inventory = () => {
    const { palette } = useTheme();
    const styles = styling(palette);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Inventory</Text>
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: palette.primaryBackground,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            color: palette.primaryText,
        },
    });

export default Inventory;
