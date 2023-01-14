import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Metrics from 'assets/metrics';
import { Themes } from 'assets/themes';
import { Icon } from 'react-native-elements';
import { iconButtonStyle } from 'utilities/staticData';

interface IProps {
    onPress(): void;
}

const FloatingButton = ({ onPress }: IProps) => {
    return (
        <TouchableOpacity style={[iconButtonStyle, styles.floatButton]} onPress={onPress}>
            <Icon name="add" color="white" size={40} />
        </TouchableOpacity>
    );
};

export default FloatingButton;

const styles = StyleSheet.create({
    floatButton: {
        width: Metrics.screenWidth * 0.15,
        aspectRatio: 1,
        bottom: Metrics.screenHeight * 0.03,
        right: Metrics.screenWidth * 0.05,
        borderRadius: Metrics.screenWidth * 0.2,
        backgroundColor: Themes.COLORS.primary,
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1,
    },
});
