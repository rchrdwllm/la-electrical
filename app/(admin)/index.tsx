import { View } from 'react-native';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

const Admin = () => {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.addListener('beforeRemove', e => {
            e.preventDefault();

            navigation.dispatch(e.data.action);
        });
    }, []);

    return <View></View>;
};

export default Admin;
