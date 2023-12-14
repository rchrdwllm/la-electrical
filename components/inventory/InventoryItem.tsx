import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Text from '../shared/Text';
import { Colors, Inventory } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface InventoryItemProps extends Inventory {
    index: number;
    setInventoryToEdit: (id: number) => void;
}

const InventoryItem = ({
    setInventoryToEdit,
    image,
    name,
    number,
    index,
    id,
}: InventoryItemProps) => {
    const { palette } = useTheme();
    const styles = styling(palette);

    return (
        <Pressable
            onPress={() => setInventoryToEdit(id)}
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
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={image}></Image>
            </View>

            <Text fontWeight="medium">{name}</Text>
            <Text style={styles.text}>{number} pieces</Text>
        </Pressable>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            borderRadius: 16,
            padding: 20,
            backgroundColor: palette.secondaryBackground,
            flex: 1,
            elevation: 10,
            shadowColor: palette.primaryShadow,
            shadowOffset: {
                width: 0,
                height: 7,
            },
            shadowOpacity: 0.3,
            shadowRadius: 9.11,
        },
        text: {
            color: palette.primaryAccent,
        },
        image: {
            height: 100,
            width: 100,
        },
        imageContainer: {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
        },
    });

export default InventoryItem;
