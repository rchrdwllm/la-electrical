import { StyleSheet, Image } from 'react-native';
import Reanimated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { Colors } from '../types';

const SplashScreen = () => {
    const { theme, palette } = useTheme();
    const styles = styling(palette);

    return (
        <Reanimated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
            <Image
                source={
                    theme === 'light'
                        ? require('../assets/logo_dark.png')
                        : require('../assets/logo_light.png')
                }
                style={styles.logo}
            />
        </Reanimated.View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: palette.primaryBackground,
        },
        logo: {
            height: 128,
            width: 128,
        },
    });

export default SplashScreen;
