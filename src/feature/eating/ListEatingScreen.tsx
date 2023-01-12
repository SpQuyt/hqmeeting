import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon, Header, Text as TextElement, ButtonGroup, Input } from 'react-native-elements';
import { createPlaceAPI, deletePlaceAPI, getListCategoriesAPI, getListEatAPI } from 'api/modules/api-app/places';
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
import { isEqual } from 'lodash';

const ListEatingScreen = () => {
    const [selectedModeIndex, setSelectedModeIndex] = useState(0);
    const [currentListEat, setCurrentListEat] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filterObject, setFilterObject] = useState<IFilter>({
        keyword: '',
        visited: undefined,
        false_place: undefined,
        currentCategoriesArr: [],
    });
    const [defaultFilterObject, setDefaultFilterObject] = useState<IFilter>(filterObject);
    const modalize = ModalizeManager();
    const getUserData = async (filter: IFilter) => {
        try {
            const newListEat = await getListEatAPI(filter);
            setCurrentListEat(newListEat);
        } catch (err) {
            AlertMessage(`${err}`);
            console.log(err);
        }
    };

    const getListCategoriesData = async () => {
        try {
            const newListCategories = await getListCategoriesAPI();
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
        if (isEqual(filterObject, defaultFilterObject)) {
            return null;
        }
        return (
            <View style={{ paddingHorizontal: 20 }}>
                <TextElement>{`Đã tới chưa: ${renderVisited(filterObject?.visited)}`}</TextElement>
                <TextElement>{`Địa điểm có thật: ${renderFalsePlace(filterObject?.false_place)}`}</TextElement>
                <TextElement>
                    {`Thể loại địa điểm: ${renderCategories(filterObject?.currentCategoriesArr)}`}
                </TextElement>
            </View>
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
                                        categoriesArrFromProps={defaultFilterObject?.currentCategoriesArr || []}
                                        onConfirm={async data => {
                                            modalize.dismiss('addFood');
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
                <Space size="l" />
            </Row>
            {renderFilterSummaryText()}
            <Space />
            <View style={{ flex: 1 }}>
                {selectedModeIndex === 0 ? (
                    <StyledList
                        contentContainerStyle={{ flexGrow: 1 }}
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
        </View>
    );
};

export default ListEatingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
