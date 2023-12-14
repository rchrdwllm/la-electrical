import { View, StyleSheet } from 'react-native';
import Text from '../shared/Text';
import { Colors, Inventory } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface InventoryItemProps extends Inventory {
    index: number;
}

const InventoryItem = ({ image, name, number, index }: InventoryItemProps) => {
    const { palette } = useTheme();
    const styles = styling(palette);

    return (
        <View
            style={[
                styles.container,
                index % 2 === 0
                    ? {
                          marginRight: 10,
                      }
                    : {
                          marginLeft: 10,
                      },
            ]}
        >
            <Text>{name}</Text>
            <Text>{number}</Text>
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            padding: 20,
            backgroundColor: palette.secondaryBackground,
            flex: 1,
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

export default InventoryItem;
