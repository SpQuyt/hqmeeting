import { Themes } from 'assets/themes';
import { StyleProp } from 'react-native';

export const staticValue = {
    DEFAULT: 1,
    TIME_IMAGE_LOAD: 500,
};

export const ERRORS = {
    default: 'common.error.unknown',
    network: 'common.error.network',
};

export const dataPicker = [
    'label1',
    'label2',
    'label3',
    'label4',
    'label5',
    'label6',
    'label7',
    'label8',
    'label9',
    'label10',
];

export const dataDropdown = ['option 1 ', 'option 2', 'option 3', 'option 4'];

export const titleHeaderStyle: StyleProp<any> = { color: Themes.COLORS.white, fontWeight: 'bold' };
export const iconButtonStyle: StyleProp<any> = { padding: 5 };
