import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import React, { Dispatch, SetStateAction, memo, useEffect, useState } from 'react';
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
import { useReservationsStore } from '../../zustand/store';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import TextInput from './TextInput';
import Button from './Button';
import Select from './Select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ScreenLoader from './ScreenLoader';
import { Timestamp } from 'firebase/firestore';
import { updateReservation } from '../../utils/reservations';
import { services } from '../../constants/types-of-services';
import { modesOfPayment } from '../../constants/modes-of-payment';
import { inventoryItems } from '../../constants/inventory-items';

interface EditInventoryProps {
    setInventoryToEdit: Dispatch<SetStateAction<number | null>>;
    inventoryToEdit: number;
}

const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const EditInventory = ({ setInventoryToEdit, inventoryToEdit }: EditInventoryProps) => {
    const { palette } = useTheme();
    const styles = styling(palette);
    const reservation = inventoryItems.find(item => item.id === inventoryToEdit);
    const offset = useSharedValue(0);
    const { height } = useWindowDimensions();
    const [screenLoading, setScreenLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(false);
        setInventoryToEdit(null);
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
                        Edit inventory
                    </Text>
                    <View style={styles.forms}>
                        {screenLoading && <ScreenLoader />}
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
            marginTop: 32,
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
    });

export default memo(EditInventory);
