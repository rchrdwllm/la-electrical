import { View, StyleSheet, Image, Platform, Animated } from 'react-native';
import Button from '../../components/shared/Button';
import Text from '../../components/shared/Text';
import { Colors } from '../../types';
import TransparentButton from '../../components/shared/TransparentButton';
import ArchiveIcon from '../../assets/icons/archive-icon.svg';
import CardStackIcon from '../../assets/icons/card-stack-icon.svg';
import TextInput from '../../components/shared/TextInput';
import ReservationsSection from '../../components/home/ReservationsSection';
import { Link } from 'expo-router';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';

const Admin = () => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useAuth();
    const { theme, palette } = useTheme();
    const styles = styling(palette);
    const { top } = useSafeAreaInsets();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [headerHeight, setHeaderHeight] = useState(0);

    if (!user) return null;

    const handleSignOut = async () => {
        setLoading(true);

        await new Promise(resolve => {
            setTimeout(async () => {
                await signOut(firebaseAuth);

                resolve('Logged out');
            }, 1000);
        });

        setLoading(false);
        setUser(null);
    };

    useEffect(() => {
        if (theme === 'dark') {
            setStatusBarStyle('light');
        }
    }, [theme]);

    return (
        <View style={styles.container}>
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
            <Animated.ScrollView
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
                                setStatusBarStyle(y >= headerHeight - 90 ? 'dark' : 'light');
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
                                        outputRange: [-headerHeight / 2, 0, headerHeight * 0.75],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <Animated.Image
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
                                paddingTop: top,
                            },
                        ]}
                    >
                        <Image
                            style={styles.headerLogo}
                            source={require('../../assets/logo_light.png')}
                        />
                        <Text fontWeight="bold" style={styles.greeting}>
                            Hello, Admin!
                        </Text>
                        <TextInput
                            placeholder="Search..."
                            placeholderTextColor={palette.invertedOnAccent}
                            style={styles.searchInput}
                        />
                        <View style={styles.headerBtns}>
                            <Link href="/reservations" asChild>
                                <TransparentButton style={styles.headerBtn} Icon={CardStackIcon}>
                                    Reservations
                                </TransparentButton>
                            </Link>
                            <Link href="/inventory" asChild>
                                <TransparentButton style={styles.headerBtn} Icon={ArchiveIcon}>
                                    Inventory
                                </TransparentButton>
                            </Link>
                        </View>
                    </View>
                </Animated.View>
                <View style={styles.curvedSeparator}></View>
                <View style={styles.content}>
                    <ReservationsSection />
                    <Text>Email: {user.email}</Text>
                    <Button
                        text="Sign out"
                        showText={!loading}
                        disabled={loading}
                        loading={loading}
                        onPress={handleSignOut}
                    />
                </View>
            </Animated.ScrollView>
        </View>
    );
};

const styling = (palette: Colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: palette.primaryBackground,
        },
        safeAreaView: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            backgroundColor: palette.primaryBackground,
            zIndex: 2,
        },
        logoutBtn: {
            width: '100%',
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
        headerBg: {
            width: '150%',
            height: 380,
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
            paddingVertical: 32,
        },
        curvedSeparator: {
            height: 64,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            backgroundColor: palette.primaryBackground,
            marginTop: -32,
        },
        content: {
            height: 2000,
            backgroundColor: palette.primaryBackground,
            marginTop: -32,
            gap: 16,
            paddingHorizontal: 16,
            paddingBottom: 32,
        },
    });

export default Admin;
