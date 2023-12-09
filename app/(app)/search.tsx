import {
    View,
    StyleSheet,
    TextInput as RNTextInput,
    Keyboard,
    useWindowDimensions,
} from 'react-native';
import TextInput from '../../components/shared/TextInput';
import { Colors, SearchCategory } from '../../types';
import Button from '../../components/shared/Button';
import Reanimated, {
    FadeInLeft,
    FadeInRight,
    FadeOutLeft,
    FadeOutRight,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import ButtonToggles from '../../components/shared/ButtonToggles';
import Text from '../../components/shared/Text';
import ReservationsResults from '../../components/search/ReservationsResults';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import { searchCategories } from '../../constants/search-categories';
import { useReservationsStore } from '../../zustand/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EditReservation from '../../components/shared/EditReservation';
import ListEmpty from '../../components/shared/ListEmpty';
import ScreenLoader from '../../components/shared/ScreenLoader';

const Search = () => {
    const { palette } = useTheme();
    const styles = styling(palette);
    const { top } = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const textInputRef = useRef<RNTextInput>(null);
    const [toggledCategory, setToggledCategory] = useState<SearchCategory>(searchCategories[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [reservationToEdit, setReservationToEdit] = useState<string | null>(null);
    const { reservations } = useReservationsStore();
    const scaleValue = useSharedValue(1);
    const borderRadiusValue = useSharedValue(0);
    const filteredReservations = useMemo(() => {
        if (searchQuery) {
            const filteredReservations = reservations.filter(reservation => {
                const { name, typeOfService, price, reservationDate } = reservation;
                return (
                    name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    typeOfService.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    price.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                    `${Intl.DateTimeFormat(navigator.language, {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                    }).format(reservationDate.toDate())} ${Intl.DateTimeFormat('en', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    }).format(new Date(reservationDate.toDate()))}`
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                );
            });
            return filteredReservations;
        } else {
            return [];
        }
    }, [searchQuery, reservations]);
    const reservationsEmpty = useMemo(
        () => (filteredReservations.length ? false : true),
        [filteredReservations]
    );

    useEffect(() => {
        Keyboard.addListener('keyboardDidHide', () => {
            if (textInputRef.current) {
                textInputRef.current.blur();
                setIsFocused(false);
            }
        });
    }, []);

    useEffect(() => {
        if (reservationToEdit) {
            scaleValue.value = withTiming(0.9);
            borderRadiusValue.value = withTiming(8);
        } else {
            scaleValue.value = withTiming(1);
            borderRadiusValue.value = withTiming(1);
        }
    }, [reservationToEdit]);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

    const animatedScale = useAnimatedStyle(() => ({
        transform: [
            {
                scale: scaleValue.value,
            },
        ],
        borderRadius: borderRadiusValue.value,
    }));

    const animatedReservations = useAnimatedStyle(() => {
        const isToggled = toggledCategory.title === 'Reservations';

        return {
            transform: [
                {
                    translateX: isToggled
                        ? withSpring(0, {
                              mass: 1,
                              damping: 18,
                              stiffness: 150,
                              overshootClamping: false,
                              restDisplacementThreshold: 0.01,
                              restSpeedThreshold: 2,
                          })
                        : withSpring(-width, {
                              mass: 1,
                              damping: 18,
                              stiffness: 150,
                              overshootClamping: false,
                              restDisplacementThreshold: 0.01,
                              restSpeedThreshold: 2,
                          }),
                },
            ],
            opacity: isToggled ? withTiming(1) : withTiming(0),
        };
    });

    const animatedInventory = useAnimatedStyle(() => {
        const isToggled = toggledCategory.title === 'Inventory';

        return {
            transform: [
                {
                    translateX: isToggled
                        ? withSpring(-width, {
                              mass: 1,
                              damping: 18,
                              stiffness: 150,
                              overshootClamping: false,
                              restDisplacementThreshold: 0.01,
                              restSpeedThreshold: 2,
                          })
                        : withSpring(0, {
                              mass: 1,
                              damping: 18,
                              stiffness: 150,
                              overshootClamping: false,
                              restDisplacementThreshold: 0.01,
                              restSpeedThreshold: 2,
                          }),
                },
            ],
            opacity: isToggled ? withTiming(1) : withTiming(0),
        };
    });

    const handleCancel = () => {
        setIsFocused(false);
        textInputRef.current?.blur();

        if (!searchQuery) {
            router.canGoBack() ? router.back() : router.replace('/index');
        }
    };

    return (
        <GestureHandlerRootView style={styles.parentContainer}>
            <StatusBar animated style="auto" />
            <Reanimated.View
                style={[
                    styles.container,
                    {
                        paddingTop: top,
                    },
                    animatedScale,
                ]}
            >
                {isLoading && <ScreenLoader />}
                <View style={styles.searchHeader}>
                    <Reanimated.View layout={Layout} style={styles.searchContainer}>
                        <TextInput
                            placeholder="Search..."
                            placeholderTextColor={palette.secondaryText}
                            style={styles.searchInput}
                            layout={Layout}
                            onFocus={() => setIsFocused(!isFocused)}
                            ref={textInputRef}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                        {isFocused && (
                            <Button
                                entering={FadeInRight.delay(250)}
                                exiting={FadeOutRight}
                                variant="tertiary"
                                text="Cancel"
                                style={styles.cancelBtn}
                                onPress={handleCancel}
                            />
                        )}
                    </Reanimated.View>
                    <ButtonToggles
                        categories={searchCategories}
                        toggledCategory={toggledCategory}
                        setToggledCategory={setToggledCategory}
                    />
                </View>
                <View style={styles.searchContent}>
                    <Reanimated.View style={[styles.reservationsContent, animatedReservations]}>
                        {reservationsEmpty && (
                            <ListEmpty text="Nothing here! Maybe try to search something?" />
                        )}
                        <ReservationsResults
                            reservations={filteredReservations}
                            setReservationToEdit={setReservationToEdit}
                        />
                    </Reanimated.View>
                    <Reanimated.View style={[styles.inventoryContent, animatedInventory]}>
                        <ListEmpty text="Looking for something? Search it up!" />
                    </Reanimated.View>
                </View>
            </Reanimated.View>
            {reservationToEdit && (
                <EditReservation
                    reservationToEdit={reservationToEdit}
                    setReservationToEdit={setReservationToEdit}
                />
            )}
        </GestureHandlerRootView>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        parentContainer: {
            flex: 1,
            backgroundColor: palette.black,
        },
        container: {
            flex: 1,
            backgroundColor: palette.primaryBackground,
        },
        searchHeader: {
            paddingHorizontal: 16,
            paddingBottom: 16,
            gap: 16,
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
        searchContent: {
            flex: 1,
            flexDirection: 'row',
        },
        reservationsContent: {
            width: '100%',
        },
        inventoryContent: {
            width: '100%',
            paddingHorizontal: 16,
        },
    });

export default Search;
