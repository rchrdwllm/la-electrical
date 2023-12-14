import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Text from '../shared/Text';
import { Colors, Inventory } from '../../types';
import Reanimated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable);

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
    const scaleProgress = useSharedValue(1);

    const onPressIn = () => {
        scaleProgress.value = 0.95;
    };

    const onPressOut = () => {
        scaleProgress.value = 1;
    };

    const animatedScale = useAnimatedStyle(() => ({
        transform: [
            {
                scale: withTiming(scaleProgress.value, {
                    duration: 1000,
                    easing: Easing.out(Easing.exp),
                }),
            },
        ],
    }));

    return (
        <AnimatedPressable
            onPress={() => setInventoryToEdit(id)}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[
                styles.container,
                index % 2 === 0
                    ? {
                          marginRight: 10,
                      }
                    : {
                          marginLeft: 10,
                      },
                animatedScale,
            ]}
        >
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={image}></Image>
            </View>
            <Text fontWeight="medium">{name}</Text>
            <Text style={styles.text}>{number} pieces</Text>
        </AnimatedPressable>
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
