import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon, Header, Text as TextElement, ButtonGroup } from 'react-native-elements';
import { getListEatAPI } from 'api/modules/api-app/places';
import { StyledList } from 'components/base';
import { Themes } from 'assets/themes';
import { iconButtonStyle, titleHeaderStyle } from 'utilities/staticData';
import { IPlace } from 'utilities/CommonInterface';
import ItemPlace from 'components/common/ItemPlace';
import Row from 'components/common/Row';
import { navigate } from 'navigation/NavigationService';
import { TAB_NAVIGATION_ROOT } from 'navigation/config/routes';
import Space from 'components/common/Space';
import Metrics from 'assets/metrics';

const ListEatingScreen = () => {
    const [selectedModeIndex, setSelectedModeIndex] = useState(0);
    const [currentListEat, setCurrentListEat] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const getUserData = async () => {
        try {
            const newListEat = await getListEatAPI();
            setCurrentListEat(newListEat);
        } catch (err) {
            console.log(err);
        }
    };

    const handleRefresh = async () => {
        try {
            setIsRefreshing(true);
            await getUserData();
        } catch (err) {
            console.log(err);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        handleRefresh();
    }, [selectedModeIndex]);

    return (
        <View style={styles.container}>
            <Header
                backgroundColor={Themes.COLORS.primary}
                centerComponent={
                    <TextElement h4 h4Style={titleHeaderStyle}>
                        Danh sách ăn uống
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
            <Row justify="flex-end" fullWidth={false}>
                <ButtonGroup
                    buttons={['Danh sách', 'Bản đồ']}
                    selectedIndex={selectedModeIndex}
                    onPress={value => {
                        setSelectedModeIndex(value);
                    }}
                    containerStyle={{ width: Metrics.screenWidth * 0.5 }}
                />
            </Row>
            <Space />
            {selectedModeIndex === 0 ? (
                <StyledList
                    contentContainerStyle={{ flex: 1 }}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    data={currentListEat}
                    renderItem={({ item }: { item: IPlace }) => {
                        return (
                            <ItemPlace
                                item={item}
                                onPress={curItem => {
                                    navigate(TAB_NAVIGATION_ROOT.EATING_ROUTE.DETAILS, { itemFromRoute: curItem });
                                }}
                            />
                        );
                    }}
                />
            ) : null}
        </View>
    );
};

export default ListEatingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
