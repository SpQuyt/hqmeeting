import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon, Header, Text as TextElement, ButtonGroup } from 'react-native-elements';
import { createPlaceAPI, deletePlaceAPI, getListEatAPI } from 'api/modules/api-app/places';
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
import ModalizeManager from 'components/base/modal/ModalizeManager';
import ModalFormAddPlaces from 'components/common/ModalFormAddPlaces';
import AlertMessage from 'components/base/AlertMessage';
import StyledOverlayLoading from 'components/base/StyledOverlayLoading';

const ListEatingScreen = () => {
    const [selectedModeIndex, setSelectedModeIndex] = useState(0);
    const [currentListEat, setCurrentListEat] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const modalize = ModalizeManager();
    const getUserData = async () => {
        try {
            const newListEat = await getListEatAPI();
            setCurrentListEat(newListEat);
        } catch (err) {
            AlertMessage(`${err}`);
        }
    };

    const addUserData = async (data: IPlace) => {
        try {
            setIsLoading(true);
            await createPlaceAPI(data);
        } catch (err) {
            AlertMessage(`${err}`);
        } finally {
            setIsLoading(false);
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
            <StyledOverlayLoading visible={isLoading} />
            <Header
                backgroundColor={Themes.COLORS.primary}
                centerComponent={
                    <TextElement h4 h4Style={titleHeaderStyle}>
                        Danh sách ăn uống
                    </TextElement>
                }
                rightComponent={
                    <Row fullWidth={false}>
                        <TouchableOpacity
                            style={iconButtonStyle}
                            onPress={() => {
                                modalize.show(
                                    'addFood',
                                    <ModalFormAddPlaces
                                        onConfirm={async data => {
                                            modalize.dismiss('addFood');
                                            await addUserData(data);
                                            await getUserData();
                                        }}
                                    />,
                                    {
                                        modalStyle: {
                                            backgroundColor: Themes.COLORS.blue,
                                        },
                                        closeOnOverlayTap: false,
                                        adjustToContentHeight: true,
                                        disableScrollIfPossible: false,
                                        containerStyleCenter: {
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        },
                                        panGestureEnabled: false,
                                    },
                                );
                            }}
                        >
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
                                onDelete={async curItem => {
                                    try {
                                        setIsLoading(true);
                                        await deletePlaceAPI(curItem?.id || '');
                                        await getUserData();
                                    } catch (err) {
                                        AlertMessage(`${err}`);
                                    } finally {
                                        setIsLoading(false);
                                    }
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
