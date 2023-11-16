import type { Colors } from '../types';

export const light: Colors = {
    primaryText: '#271302',
    secondaryText: '#7C7167',
    invertedText: '#FFFFFF',
    invertedOnAccent: '#FFFFFF',
    primaryBackground: '#FAFAFA',
    secondaryBackground: '#FFFFFF',
    overlayPrimaryBackground: '#F8F5F233',
    primaryAccent: '#FA9F42',
    secondaryAccent: '#F8F5F2',
    primaryBorder: '#F4EFEB',
    primaryShadow: '#F3CEAA',
};

export const dark: Colors = {
    primaryText: '#FAFAFA',
    secondaryText: '#7C7167',
    invertedText: '#0F0701',
    invertedOnAccent: '#FFFFFF',
    primaryBackground: '#0F0701',
    secondaryBackground: '#1C150F',
    overlayPrimaryBackground: '#F8F5F233',
    primaryAccent: '#FFC996',
    secondaryAccent: '#231A12',
    primaryBorder: '#302824',
    primaryShadow: '#000000',
};

export default { light, dark };
