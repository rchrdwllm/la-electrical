import { useColorScheme } from 'react-native';
import colors from '../constants/colors';

export const useTheme = () => {
    const theme = useColorScheme() ?? 'light';

    return {
        theme,
        palette: colors[theme],
    };
};
