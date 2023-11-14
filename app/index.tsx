import { Colors } from '../types';
import { View, StyleSheet } from 'react-native';
import Text from '../components/base/Text';
import Link from '../components/base/Link';
import { useTheme } from '../hooks/useTheme';

const Home = () => {
    const { palette } = useTheme();
    const styles = styling(palette);

    return (
        <View style={styles.container}>
            <Link href="sign-in">
                <Text>Landing</Text>
            </Link>
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: palette.primaryBackground,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

export default Home;
