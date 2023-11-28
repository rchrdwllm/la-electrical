import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

const selectHook = <T>({ useIos, useAndroid }: { useIos: T; useAndroid: T }) => {
    return Platform.select({
        default: useIos,
        android: useAndroid,
    });
};

/**
 * Quick workaround for refreshing issue on Android:
 * The refresh control is showing up above the header when unmounting the screen.
 * Note: It's happening when using a custom header component, but I haven't tried using
 * the native header from the native stack.
 */
export const useProgressViewOffset = selectHook({
    useAndroid: () => {
        const navigation = useNavigation();
        const [progressViewOffset, setProgressViewOffset] = useState<undefined | number>(undefined);
        const goBackEventWasHandled = useRef(false);

        // prevent the navigation event and hide the refresh indicator
        useEffect(() => {
            const unsubscribe = navigation.addListener('beforeRemove', event => {
                // Handle GO_BACK event only, because it fits my use case, please tweak it to fit yours
                if (event.data.action.type === 'GO_BACK' && !goBackEventWasHandled.current) {
                    event.preventDefault();
                    goBackEventWasHandled.current = true;
                    setProgressViewOffset(-1000); // set to a ridiculous value to hide the refresh control
                }
            });

            return unsubscribe;
        }, [navigation]);

        // perform the navigation with the hidden refresh indicator
        useEffect(() => {
            if (progressViewOffset !== undefined) {
                navigation.goBack();
            }
        }, [navigation, progressViewOffset]);

        return progressViewOffset;
    },
    useIos: () => undefined,
});
