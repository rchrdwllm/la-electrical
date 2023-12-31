import {
    View,
    StyleSheet,
    Pressable,
    Animated,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import Text from '../../components/shared/Text';
import { Colors } from '../../types';
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import TransparentButton from '../../components/shared/TransparentButton';
import ArchiveIcon from '../../assets/icons/archive-icon.svg';
import CardStackIcon from '../../assets/icons/card-stack-icon.svg';
import TextInput from '../../components/shared/TextInput';
import ReservationsSection from '../../components/home/ReservationsSection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewButton from '../../components/shared/NewButton';
import LogoutIcon from '../../assets/icons/logout-icon.svg';
import EditReservation from '../../components/shared/EditReservation';
import { Link, router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { useWindowDimensions } from 'react-native';
import { useReservationsStore } from '../../zustand/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const Admin = () => {
    const [loading, setLoading] = useState(false);
    const { isRefreshing, setIsRefreshing } = useReservationsStore();
    const [user, setUser] = useAuth();
    const { theme, palette } = useTheme();
    const styles = styling(palette);
    const { top } = useSafeAreaInsets();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [headerHeight, setHeaderHeight] = useState(332);
    const { height } = useWindowDimensions();
    const [reservationToEdit, setReservationToEdit] = useState<string | null>(null);
    const scaleValue = useSharedValue(1);
    const borderRadiusValue = useSharedValue(0);

    if (!user) return null;

    const handleSignOut = async () => {
        setLoading(true);

        await new Promise(resolve => {
            setTimeout(async () => {
                await signOut(firebaseAuth);

                resolve('Logged out');
            }, 1000);
        });
        await AsyncStorage.clear();

        setLoading(false);
        setUser(null);
    };

    const animatedScale = useAnimatedStyle(() => ({
        transform: [
            {
                scale: scaleValue.value,
            },
        ],
        borderRadius: borderRadiusValue.value,
    }));

    useEffect(() => {
        if (theme === 'dark') {
            setStatusBarStyle('light');
        }
    }, [theme]);

    useEffect(() => {
        if (reservationToEdit) {
            scaleValue.value = withTiming(0.9);
            borderRadiusValue.value = withTiming(8);
        } else {
            scaleValue.value = withTiming(1);
            borderRadiusValue.value = withTiming(0);
        }
    }, [reservationToEdit]);

    return (
        <GestureHandlerRootView style={styles.parentContainer}>
            <StatusBar animated style="light" />
            <Animated.View
                style={[
                    styles.safeAreaView,
                    {
                        height: top,
                        opacity: scrollY.interpolate({
                            inputRange: [headerHeight - 100, headerHeight - 90],
                            outputRange: [0, 1],
                        }),
                    },
                ]}
            ></Animated.View>
            <Reanimated.View style={[styles.container, animatedScale]}>
                <View style={{ flex: 1 }}>
                    <Animated.ScrollView
                        refreshControl={
                            <RefreshControl
                                colors={[palette.primaryAccent]}
                                progressBackgroundColor={palette.primaryBackground}
                                refreshing={isRefreshing}
                                onRefresh={() => setIsRefreshing(true)}
                            />
                        }
                        onScroll={Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: {
                                            y: scrollY,
                                        },
                                    },
                                },
                            ],
                            {
                                useNativeDriver: true,
                                listener: (e: any) => {
                                    const { y } = e.nativeEvent.contentOffset;

                                    if (theme === 'light') {
                                        setStatusBarStyle(
                                            y >= headerHeight - 90 ? 'dark' : 'light'
                                        );
                                    }
                                },
                            }
                        )}
                    >
                        <Animated.View
                            onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
                            style={[
                                styles.header,
                                {
                                    transform: [
                                        {
                                            translateY: scrollY.interpolate({
                                                inputRange: [-headerHeight, 0, headerHeight],
                                                outputRange: [
                                                    -headerHeight / 2,
                                                    0,
                                                    headerHeight * 0.75,
                                                ],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <AnimatedImage
                                style={[
                                    styles.headerBg,
                                    {
                                        transform: [
                                            {
                                                scale: scrollY.interpolate({
                                                    inputRange: [-headerHeight, 0, headerHeight],
                                                    outputRange: [2, 1, 0.75],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                                source={require('../../assets/header_bg.png')}
                                placeholder={'L1KuoaOX~8=c}=1Ns.I=K#sCnkE#'}
                            />
                            <Animated.View
                                style={[
                                    styles.headerOverlay,
                                    {
                                        height: headerHeight,
                                        opacity: scrollY.interpolate({
                                            inputRange: [headerHeight - 200, headerHeight - 90],
                                            outputRange: [0, 1],
                                        }),
                                    },
                                ]}
                            ></Animated.View>
                            <View
                                style={[
                                    styles.headerContent,
                                    {
                                        paddingTop: top / 2,
                                    },
                                ]}
                            >
                                <View style={styles.headerFlexContainer}>
                                    <Image
                                        style={styles.headerLogo}
                                        source={require('../../assets/logo_light.png')}
                                    />
                                    <View>
                                        {loading ? (
                                            <View style={styles.logoutBtnIndicator}>
                                                <ActivityIndicator
                                                    size={16}
                                                    color={palette.invertedOnAccent}
                                                />
                                            </View>
                                        ) : (
                                            <TransparentButton
                                                style={styles.logoutBtn}
                                                textStyle={
                                                    {
                                                        display: 'none',
                                                    } as any
                                                }
                                                Icon={LogoutIcon}
                                                onPress={handleSignOut}
                                            />
                                        )}
                                    </View>
                                </View>
                                <Text fontWeight="bold" style={styles.greeting}>
                                    Hello, Admin!
                                </Text>
                                <Pressable onPress={() => router.push('search')}>
                                    <View style={styles.searchInputContainer}>
                                        <TextInput
                                            placeholder="Search..."
                                            placeholderTextColor={palette.invertedOnAccent}
                                            style={styles.searchInput}
                                        />
                                    </View>
                                </Pressable>
                                <View style={styles.headerBtns}>
                                    <Link href="/reservations" asChild>
                                        <TransparentButton
                                            style={styles.headerBtn}
                                            Icon={CardStackIcon}
                                        >
                                            Reservations
                                        </TransparentButton>
                                    </Link>
                                    <Link href="/inventory" asChild>
                                        <TransparentButton
                                            style={styles.headerBtn}
                                            Icon={ArchiveIcon}
                                        >
                                            Inventory
                                        </TransparentButton>
                                    </Link>
                                </View>
                            </View>
                        </Animated.View>
                        <View style={styles.curvedSeparator}></View>
                        <View
                            style={[
                                styles.content,
                                {
                                    minHeight: height - top,
                                },
                            ]}
                        >
                            <ReservationsSection
                                reservationToEdit={reservationToEdit}
                                setReservationToEdit={setReservationToEdit}
                            />
                        </View>
                    </Animated.ScrollView>
                    <NewButton />
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
            overflow: 'hidden',
        },
        safeAreaView: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            backgroundColor: palette.primaryBackground,
            zIndex: 2,
            opacity: 0,
        },
        header: {
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerLogo: {
            height: 32,
            width: 32,
            alignSelf: 'center',
        },
        logoutBtn: {
            borderRadius: 16,
            height: 32,
            width: 32,
        },
        logoutBtnIndicator: {
            borderRadius: 16,
            height: 32,
            width: 32,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: palette.overlayPrimaryBackground,
        },
        headerBg: {
            width: '150%',
            height: 332,
            objectFit: 'cover',
        },
        headerOverlay: {
            position: 'absolute',
            flex: 1,
            width: '100%',
            zIndex: 1,
            backgroundColor: palette.primaryBackground,
            top: 0,
            left: 0,
            pointerEvents: 'none',
        },
        headerContent: {
            position: 'absolute',
            top: 32,
            left: 16,
            right: 16,
            bottom: 16,
            gap: 16,
        },
        headerFlexContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        searchInputContainer: {
            pointerEvents: 'none',
        },
        searchInput: {
            backgroundColor: palette.overlayPrimaryBackground,
        },
        greeting: {
            fontSize: 32,
            color: palette.invertedOnAccent,
        },
        headerBtns: {
            flexDirection: 'row',
            gap: 16,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        headerBtn: {
            paddingVertical: 24,
        },
        curvedSeparator: {
            height: 64,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            backgroundColor: palette.primaryBackground,
            marginTop: -32,
        },
        content: {
            backgroundColor: palette.primaryBackground,
            marginTop: -32,
            gap: 16,
            paddingHorizontal: 16,
            paddingBottom: 32,
        },
    });

export default Admin;
