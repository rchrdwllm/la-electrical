import { StyleSheet } from 'react-native';
import Reanimated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import Text from '../shared/Text';

const SectionHeader = ({ title }: { title: string }) => {
    const styles = styling();

    return (
        <Reanimated.View
            entering={FadeIn}
            exiting={FadeOut}
            layout={Layout}
            style={styles.container}
        >
            <Text fontWeight="medium">{title}</Text>
        </Reanimated.View>
    );
};

const styling = () =>
    StyleSheet.create({
        container: {
            marginTop: 16,
        },
    });

export default SectionHeader;
