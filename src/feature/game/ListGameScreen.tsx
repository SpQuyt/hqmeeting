import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Themes } from 'assets/themes';
import { Header } from 'react-native-elements';
import { TextElement } from 'react-native-elements/dist/text/Text';
import { titleHeaderStyle } from 'utilities/staticData';

const ListGameScreen = () => {
    return (
        <View style={styles.container}>
            <Header
                backgroundColor={Themes.COLORS.primary}
                centerComponent={
                    <TextElement h4 h4Style={titleHeaderStyle}>
                        Danh sách trò chơi
                    </TextElement>
                }
            />
        </View>
    );
};

export default ListGameScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
