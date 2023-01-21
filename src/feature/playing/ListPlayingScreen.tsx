import { Keyboard, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon, Header, Text as TextElement, ButtonGroup, Input, Button } from 'react-native-elements';
import {
    createPlaceAPI,
    deletePlaceAPI,
    editPlaceAPI,
    getListCategoriesPlayAPI,
    getListPlayAPI,
} from 'api/modules/api-app/places';
import { StyledList } from 'components/base';
import { Themes } from 'assets/themes';
import { iconButtonStyle, titleHeaderStyle } from 'utilities/staticData';
import { IFilter, IPlace } from 'utilities/CommonInterface';
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
import ModalFilter from 'components/common/ModalFilter';
import FloatingButton from 'components/common/FloatingButton';
import { TypePlace } from 'utilities/enum';

const ListPlayingScreen = () => {
    const [selectedModeIndex, setSelectedModeIndex] = useState(0);
    const [currentListPlay, setCurrentListPlay] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filterObject, setFilterObject] = useState<IFilter>({
        keyword: '',
        visited: false,
        false_place: undefined,
        currentCategoriesArr: [],
    });
    const [defaultFilterObject, setDefaultFilterObject] = useState<IFilter>(filterObject);
    const [isCollapsedAll, setIsCollapsedAll] = useState<boolean>(false);
    const modalize = ModalizeManager();
    const getUserData = async (filter: IFilter) => {
        try {
            const newListPlay = await getListPlayAPI(filter);
            setCurrentListPlay(newListPlay);
        } catch (err) {
            AlertMessage(`${err}`);
            console.log(err);
        }
    };

    const getListCategoriesData = async () => {
        try {
            const newListCategories = await getListCategoriesPlayAPI();
            const newFreshFilterObject = {
                ...filterObject,
                currentCategoriesArr: newListCategories?.map((item: any) => {
                    return {
                        name: item?.name,
                        isChecked: false,
                    };
                }),
            };
            setFilterObject(newFreshFilterObject);
            setDefaultFilterObject(newFreshFilterObject);
        } catch (err) {
            AlertMessage(`${err}`);
            console.log(err);
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

    const editUserData = async (data: IPlace) => {
        try {
            await editPlaceAPI(data);
        } catch (err) {
            AlertMessage(`${err}`);
            console.log(err);
        }
    };

    const handleRefresh = async () => {
        try {
            setIsRefreshing(true);
            await getUserData(filterObject);
        } catch (err) {
            AlertMessage(`${err}`);
            console.log(err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const renderFilterSummaryText = () => {
        const renderVisited = (booleanVar?: boolean) => {
            if (booleanVar === undefined) return 'Chưa xác định';
            if (booleanVar === true) return 'Đã tới';
            return 'Chưa tới';
        };
        const renderFalsePlace = (booleanVar?: boolean) => {
            if (booleanVar === undefined) return 'Chưa xác định';
            if (booleanVar === true) return 'Thật';
            return 'Giả';
        };
        const renderCategories = (newCategories?: Array<{ name: string; isChecked: boolean }>) => {
            if (!newCategories) return '';
            const newCategoriesTextOnly = newCategories?.filter(item => item?.isChecked)?.map(item => item?.name);
            return newCategoriesTextOnly?.join(', ');
        };
        return (
            <Row>
                <View style={{ paddingHorizontal: 20, width: '60%' }}>
                    <TextElement>{`Đã tới chưa: ${renderVisited(filterObject?.visited)}`}</TextElement>
                    <TextElement>{`Địa điểm có thật: ${renderFalsePlace(filterObject?.false_place)}`}</TextElement>
                    <TextElement>
                        {`Thể loại địa điểm: ${renderCategories(filterObject?.currentCategoriesArr)}`}
                    </TextElement>
                </View>
                <Button
                    title={isCollapsedAll ? 'Thu gọn tất cả' : 'Mở rộng tất cả'}
                    onPress={() => {
                        setIsCollapsedAll(!isCollapsedAll);
                    }}
                    containerStyle={{ marginRight: 15, borderRadius: 10 }}
                    titleStyle={{ fontSize: 14 }}
                />
            </Row>
        );
    };

    const handleAddPlace = () => {
        modalize.show(
            'addEditPlay',
            <ModalFormAddPlaces
                modalId="addEditPlay"
                typeFromProps={TypePlace.PLAY}
                categoriesArrFromProps={defaultFilterObject?.currentCategoriesArr || []}
                onConfirm={async data => {
                    modalize.dismiss('addEditPlay');
                    await addUserData(data);
                    await getUserData(filterObject);
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
    };

    useEffect(() => {
        getListCategoriesData();
    }, []);

    useEffect(() => {
        getUserData(filterObject);
    }, [filterObject]);

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
                        Danh sách du lịch
                    </TextElement>
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
            <Row>
                <Input
                    placeholder="Nhập từ khoá tìm kiếm"
                    leftIcon={<Icon name="search" />}
                    rightIcon={
                        <Icon
                            name="close"
                            onPress={() => {
                                setFilterObject({
                                    ...filterObject,
                                    keyword: '',
                                });
                            }}
                            type={iconButtonStyle}
                        />
                    }
                    value={filterObject?.keyword}
                    onChangeText={text => {
                        setFilterObject({
                            ...filterObject,
                            keyword: text,
                        });
                    }}
                    containerStyle={{ width: '85%' }}
                />
                <Icon
                    containerStyle={{ borderWidth: 1, borderRadius: 10, padding: 5 }}
                    name="filter-list"
                    color="black"
                    onPress={() => {
                        Keyboard.dismiss();
                        modalize.show(
                            'filter',
                            <ModalFilter
                                typePlace={TypePlace.PLAY}
                                defaultFilterObjectFromProps={defaultFilterObject}
                                filterFromProps={filterObject}
                                onConfirm={async (filter: IFilter) => {
                                    modalize.dismiss('filter');
                                    setFilterObject(filter);
                                    await getUserData(filter);
                                }}
                            />,
                            {
                                modalStyle: {
                                    backgroundColor: Themes.COLORS.blue,
                                },
                                closeOnOverlayTap: false,
                                isCenter: true,
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
                />
                <Space />
            </Row>
            {renderFilterSummaryText()}
            <Space size="l" />
            <View style={{ flex: 1 }}>
                {selectedModeIndex === 0 ? (
                    <StyledList
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        data={currentListPlay}
                        renderItem={({ item }: { item: IPlace }) => {
                            return (
                                <ItemPlace
                                    item={item}
                                    isCollapsedAllFromProps={isCollapsedAll}
                                    onPress={curItem => {
                                        navigate(TAB_NAVIGATION_ROOT.PLAYING_ROUTE.DETAILS, { itemFromRoute: curItem });
                                    }}
                                    onEdit={curItem => {
                                        modalize.show(
                                            'addEditPlay',
                                            <ModalFormAddPlaces
                                                modalId="addEditPlay"
                                                typeFromProps={TypePlace.PLAY}
                                                dataFromEdit={curItem}
                                                categoriesArrFromProps={defaultFilterObject?.currentCategoriesArr || []}
                                                onConfirm={async data => {
                                                    modalize.dismiss('addEditPlay');
                                                    await editUserData(data);
                                                    await getUserData(filterObject);
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
                                    onDelete={async curItem => {
                                        try {
                                            setIsLoading(true);
                                            await deletePlaceAPI(curItem?.id || '');
                                            await getUserData(filterObject);
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
            <FloatingButton onPress={handleAddPlace} />
        </View>
    );
};

export default ListPlayingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
