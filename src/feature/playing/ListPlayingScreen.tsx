import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Themes } from 'assets/themes';
import { Header, Icon } from 'react-native-elements';
import { TextElement } from 'react-native-elements/dist/text/Text';
import { titleHeaderStyle, iconButtonStyle } from 'utilities/staticData';
import Row from 'components/common/Row';

const ListPlayingScreen = () => {
    return (
        <View style={styles.container}>
            <Header
                backgroundColor={Themes.COLORS.primary}
                centerComponent={
                    <TextElement h4 h4Style={titleHeaderStyle}>
                        Danh sách đi chơi
                    </TextElement>
                }
                rightComponent={
                    <Row fullWidth={false}>
                        <TouchableOpacity style={iconButtonStyle} onPress={() => {}}>
                            <Icon name="add" color="white" />
                        </TouchableOpacity>
                    </Row>
                }
            />
        </View>
    );
};

export default ListPlayingScreen;

const styles = StyleSheet.create({
    container: {},
});
