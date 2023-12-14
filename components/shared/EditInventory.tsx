import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import React, { Dispatch, SetStateAction, memo, useState } from 'react';
import Text from './Text';
import Reanimated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Button from './Button';
import { inventoryItems } from '../../constants/inventory-items';
import { Image } from 'expo-image';
import PlusIcon from '../../assets/icons/plus-icon.svg';
import MinusIcon from '../../assets/icons/minus-icon.svg';
import { useInventoryStore } from '../../zustand/store';

interface EditInventoryProps {
    setInventoryToEdit: Dispatch<SetStateAction<number | null>>;
    inventoryToEdit: number;
}

const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const EditInventory = ({ setInventoryToEdit, inventoryToEdit }: EditInventoryProps) => {
    const { palette } = useTheme();
    const styles = styling(palette);
    const { inventoryItemById } = useInventoryStore();
    const inventoryItem = inventoryItemById(inventoryToEdit);
    const offset = useSharedValue(0);
    const { height } = useWindowDimensions();
    const [screenLoading, setScreenLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { editInventory } = useInventoryStore();
    const [count, setCount] = useState(inventoryItem.number);

    const toggleModal = () => {
        setInventoryToEdit(null);

        offset.value = 0;
    };

    const pan = Gesture.Pan()
        .onChange(e => {
            offset.value += e.changeY;
        })
        .onFinalize(() => {
            if (offset.value < height / 3) {
                offset.value = withSpring(0, {
                    mass: 1,
                    damping: 20,
                    stiffness: 175,
                    overshootClamping: false,
                    restDisplacementThreshold: 0.01,
                    restSpeedThreshold: 2,
                });
            } else {
                runOnJS(toggleModal)();

                offset.value = withSpring(height);
            }
        });

    const animatedY = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: offset.value,
            },
        ],
    }));

    const handleCancel = () => {
        setInventoryToEdit(null);
    };

    const handleSave = async () => {
        setIsLoading(true);

        await new Promise(resolve => {
            editInventory(inventoryItem.id, {
                ...inventoryItem,
                number: count,
            });

            setTimeout(() => {
                setIsLoading(false);
                resolve('resolved');
            }, 500);
        });

        setInventoryToEdit(null);
    };

    const handleMinus = () => {
        if (count !== 0) {
            setCount(count - 1);
        }
    };

    const handlePlus = () => {
        setCount(count + 1);
    };

    return (
        <View style={styles.modalContainer}>
            <StatusBar animated style="light" />
            <AnimatedPressable
                entering={FadeIn}
                exiting={FadeOut}
                onPress={() => setInventoryToEdit(null)}
                style={styles.modalOverlay}
            ></AnimatedPressable>
            <GestureDetector gesture={pan}>
                <Reanimated.View
                    entering={SlideInDown.springify()
                        .damping(20)
                        .mass(1)
                        .stiffness(175)
                        .restDisplacementThreshold(0.01)
                        .restSpeedThreshold(2)
                        .overshootClamping(0)}
                    exiting={SlideOutDown}
                    style={[styles.modal, animatedY]}
                >
                    <View style={styles.pill} />
                    <Text fontWeight="bold" style={styles.heading}>
                        {inventoryItem.name}
                    </Text>
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={inventoryItem.image}></Image>
                    </View>
                    <Text fontWeight="bold" style={styles.heading}>
                        Total Pieces
                    </Text>
                    <View style={styles.buttonContainer}>
                        <Button
                            iconSize={24}
                            style={styles.button}
                            iconColor={palette.invertedText}
                            Icon={MinusIcon}
                            onPress={handleMinus}
                        />
                        <Text fontWeight="bold" style={styles.countText}>
                            {count}
                        </Text>
                        <Button
                            iconSize={24}
                            style={styles.button}
                            iconColor={palette.invertedText}
                            Icon={PlusIcon}
                            onPress={handlePlus}
                        />
                    </View>
                    <View style={styles.forms}>
                        <View style={styles.btns}>
                            <Button
                                text="Cancel"
                                onPress={handleCancel}
                                style={styles.cancelBtn}
                                textStyle={styles.cancelBtnText as any}
                            />
                            <Button
                                text="Save"
                                onPress={handleSave}
                                textStyle={styles.saveBtnText as any}
                                disabled={isLoading}
                                loading={isLoading}
                                showText={!isLoading}
                            />
                        </View>
                    </View>
                </Reanimated.View>
            </GestureDetector>
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        modalContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            flex: 1,
            zIndex: 3,
        },
        modalOverlay: {
            width: '100%',
            height: '100%',
            flex: 1,
            backgroundColor: palette.modalBackground,
        },
        modal: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '93%',
            backgroundColor: palette.primaryBackground,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
            alignItems: 'center',
            gap: 32,
        },
        pill: {
            height: 6,
            width: 64,
            borderRadius: 3,
            backgroundColor: palette.secondaryText,
            opacity: 0.2,
        },
        heading: {
            fontSize: 24,
        },
        forms: {
            position: 'relative',
            width: '100%',
            gap: 16,
        },
        btns: {
            backgroundColor: palette.primaryBackground,
            gap: 16,
        },
        cancelBtn: {
            backgroundColor: palette.secondaryAccent,
        },
        cancelBtnText: {
            color: palette.primaryAccent,
        },
        saveBtnText: {
            color: palette.invertedText,
        },
        image: {
            width: 200,
            height: 200,
        },
        imageContainer: {
            height: 300,
            width: 300,
            borderRadius: 150,
            backgroundColor: palette.secondaryAccent,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonContainer: {
            backgroundColor: palette.secondaryAccent,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: 238,
            margin: 16,
            padding: 16,
            borderRadius: 16,
        },
        button: {
            height: 64,
            width: 64,
            borderRadius: 16,
        },
        countText: {
            textAlign: 'center',
            flex: 1,
            color: palette.primaryAccent,
            fontSize: 24,
        },
    });

export default memo(EditInventory);
