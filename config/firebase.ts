import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDyZIFbbo82podg3rPN3dHuTeOBFZhndDM',
    authDomain: 'la-electrical.firebaseapp.com',
    projectId: 'la-electrical',
    storageBucket: 'la-electrical.appspot.com',
    messagingSenderId: '800409224495',
    appId: '1:800409224495:web:6903cef9e6fb1dd2500dda',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
});
