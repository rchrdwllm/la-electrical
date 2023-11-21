import { View, StyleSheet } from 'react-native';
import Text from '../shared/Text';
import { Colors } from '../../types';
import Button from '../shared/Button';
import XIcon from '../../assets/icons/x-icon.svg';
import TransparentButton from '../shared/TransparentButton';
import { useTheme } from '../../hooks/useTheme';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { forwardRef } from 'react';

const NewReservationHeader = forwardRef(() => {
    const { theme, palette } = useTheme();
    const styles = styling(palette);
    const { top } = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: top + 32,
                },
            ]}
        >
            <View style={styles.btnPlaceholder} />
            <Text fontWeight="bold" style={styles.title}>
                New reservation
            </Text>
            <View>
                <TransparentButton
                    Icon={XIcon}
                    iconColor={palette.invertedText}
                    style={[
                        styles.backBtn,
                        {
                            backgroundColor:
                                theme === 'dark'
                                    ? palette.overlayInvertedBackground
                                    : palette.overlayPrimaryBackground,
                        },
                    ]}
                    onPress={() => router.back()}
                    textShown={false}
                />
            </View>
        </View>
    );
});

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
        },
        backBtn: {
            height: 40,
            width: 40,
            borderRadius: 20,
        },
        title: {
            fontSize: 24,
            color: palette.invertedText,
        },
        btnPlaceholder: {
            height: 40,
            width: 40,
            opacity: 0,
        },
    });

export default NewReservationHeader;
