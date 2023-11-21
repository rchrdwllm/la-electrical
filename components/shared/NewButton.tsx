import { View, StyleSheet } from 'react-native';
import { Colors } from '../../types';
import Button from './Button';
import PlusIcon from '../../assets/icons/plus-icon.svg';
import { Link } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';

const NewButton = () => {
    const { palette } = useTheme();
    const styles = styling(palette);

    return (
        <View style={styles.container}>
            <Link href="/new" asChild>
                <Button
                    Icon={PlusIcon}
                    style={styles.button}
                    iconSize={24}
                    iconColor={palette.invertedText}
                />
            </Link>
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            bottom: 32,
            right: 16,
            zIndex: 1,
        },
        button: {
            height: 64,
            width: 64,
            borderRadius: 32,
            elevation: 10,
            shadowColor: palette.accentShadow,
            shadowOffset: {
                width: 0,
                height: 7,
            },
            shadowOpacity: 0.3,
            shadowRadius: 9.11,
        },
    });

export default NewButton;
