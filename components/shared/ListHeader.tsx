import { View, StyleSheet } from 'react-native';
import Text from './Text';
import { Colors } from '../../types';
import Button from './Button';
import ChevronLeftIcon from '../../assets/icons/chevron-left-icon.svg';
import { useTheme } from '../../hooks/useTheme';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { forwardRef, useMemo } from 'react';

const ListHeader = forwardRef(() => {
    const { palette } = useTheme();
    const styles = styling(palette);
    const { top } = useSafeAreaInsets();
    const pathname = usePathname();
    const headerTitle = useMemo(() => {
        const slug = pathname.slice(1);
        const words = slug.split('-');

        words.forEach((word, i) => {
            words[i] = word[0].toUpperCase() + word.slice(1);
        });

        return words.join(' ');
    }, [pathname]);

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: top + 32,
                },
            ]}
        >
            <Button
                Icon={ChevronLeftIcon}
                variant="secondary"
                iconColor={palette.primaryAccent}
                style={styles.backBtn}
                onPress={() => router.back()}
            />
            <Text fontWeight="bold" style={styles.title}>
                {headerTitle}
            </Text>
            <View style={styles.btnPlaceholder} />
        </View>
    );
});

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            backgroundColor: palette.primaryBackground,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        backBtn: {
            height: 40,
            width: 40,
            borderRadius: 20,
        },
        title: {
            fontSize: 24,
        },
        btnPlaceholder: {
            height: 40,
            width: 40,
            opacity: 0,
        },
    });

export default ListHeader;
