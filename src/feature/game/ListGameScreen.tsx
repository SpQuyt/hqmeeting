import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Themes } from 'assets/themes';
import { Header, ListItem } from 'react-native-elements';
import { TextElement } from 'react-native-elements/dist/text/Text';
import { titleHeaderStyle } from 'utilities/staticData';
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import { ListItemTitle } from '@rneui/base/dist/ListItem/ListItem.Title';
import { ListItemChevron } from '@rneui/base/dist/ListItem/ListItem.Chevron';
import { navigate } from 'navigation/NavigationService';
import { TAB_NAVIGATION_ROOT } from 'navigation/config/routes';

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
            <ListItem
                topDivider
                bottomDivider
                onPress={() => {
                    navigate(TAB_NAVIGATION_ROOT.GAMING_ROUTE.TRUTH_OR_DARE);
                }}
            >
                <ListItemContent>
                    <ListItemTitle>Truth Or Dare</ListItemTitle>
                </ListItemContent>
                <ListItemChevron />
            </ListItem>
        </View>
    );
};

export default ListGameScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
