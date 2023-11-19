import { View, StyleSheet } from 'react-native';
import Text from '../shared/Text';

const SectionHeader = ({ title }: { title: string }) => {
    const styles = styling();

    return (
        <View style={styles.container}>
            <Text fontWeight="medium">{title}</Text>
        </View>
    );
};

const styling = () =>
    StyleSheet.create({
        container: {
            marginTop: 16,
        },
    });

export default SectionHeader;
