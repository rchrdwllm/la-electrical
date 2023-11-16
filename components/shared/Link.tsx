import { useNavigation } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

interface LinkProps extends PressableProps {
    href: string;
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
}

const Link = ({ href, children, style }: LinkProps) => {
    const navigation = useNavigation();

    return (
        <Pressable
            onPress={() => {
                (navigation.navigate as any)(href);
            }}
            style={style}
        >
            {children}
        </Pressable>
    );
};

export default Link;
