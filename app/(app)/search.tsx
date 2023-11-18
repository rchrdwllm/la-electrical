import { View, StyleSheet, TextInput as RNTextInput, Keyboard } from 'react-native';
import TextInput from '../../components/shared/TextInput';
import { Colors } from '../../types';
import Button from '../../components/shared/Button';
import Reanimated, { FadeInRight, FadeOutRight, Layout } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';

const Search = () => {
    const { palette } = useTheme();
    const styles = styling(palette);
    const { top } = useSafeAreaInsets();
    const [isFocused, setIsFocused] = useState(false);
    const textInputRef = useRef<RNTextInput>(null);

    useEffect(() => {
        Keyboard.addListener('keyboardDidHide', () => {
            if (textInputRef.current) {
                textInputRef.current.blur();
                setIsFocused(false);
            }
        });
    }, []);

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: top,
                },
            ]}
        >
            <StatusBar animated style="auto" />
            <View style={styles.searchHeader}>
                <Reanimated.View layout={Layout} style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search..."
                        placeholderTextColor={palette.secondaryText}
                        style={styles.searchInput}
                        layout={Layout}
                        onFocus={() => setIsFocused(!isFocused)}
                        ref={textInputRef}
                        autoFocus
                    />
                    {isFocused && (
                        <Button
                            entering={FadeInRight}
                            exiting={FadeOutRight}
                            variant="tertiary"
                            text="Cancel"
                            style={styles.cancelBtn}
                            onPress={() => {
                                setIsFocused(false);
                                textInputRef.current?.blur();
                            }}
                        />
                    )}
                </Reanimated.View>
            </View>
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: palette.primaryBackground,
        },
        searchHeader: {
            paddingHorizontal: 16,
            paddingTop: 32,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        searchInput: {
            backgroundColor: palette.secondaryAccent,
            flex: 4,
        },
        cancelBtn: {
            flex: 1,
            width: '100%',
        },
    });

export default Search;
