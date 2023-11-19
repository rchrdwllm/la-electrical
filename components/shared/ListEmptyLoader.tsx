import { ActivityIndicator, StyleSheet } from 'react-native';
import Reanimated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Colors } from '../../types';
import { useTheme } from '../../hooks/useTheme';

const ListEmptyLoader = () => {
    const { palette } = useTheme();
    const styles = styling(palette);

    return (
        <Reanimated.View exiting={FadeOut} style={styles.container}>
            <ActivityIndicator color={palette.primaryAccent} />
        </Reanimated.View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            flex: 1,
            zIndex: 1,
            backgroundColor: palette.primaryBackground,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

export default ListEmptyLoader;
