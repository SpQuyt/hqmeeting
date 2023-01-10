import { View } from 'react-native';
import React from 'react';

interface IProps {
    size?: 's' | 'm' | 'l';
}

const Space = ({ size = 's' }: IProps) => {
    let space = 8;
    if (size === 'm') {
        space = 10;
    }
    if (size === 'l') {
        space = 12;
    }
    return <View style={{ width: space, aspectRatio: 1 }} />;
};

export default Space;
