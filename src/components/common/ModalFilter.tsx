import { ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IFilter } from 'utilities/CommonInterface';
import { Button, CheckBox, Icon } from 'react-native-elements';
import { TextElement } from 'react-native-elements/dist/text/Text';
import { iconButtonStyle } from 'utilities/staticData';
import ModalizeManager from 'components/base/modal/ModalizeManager';
import Metrics from 'assets/metrics';
import { Themes } from 'assets/themes';
import { TypePlace } from 'utilities/enum';
import { isEqual } from 'lodash';
import { ListItemTitle } from '@rneui/base/dist/ListItem/ListItem.Title';
import Space from './Space';
import Row from './Row';

interface IProps {
    typePlace?: TypePlace;
    defaultFilterObjectFromProps: IFilter;
    filterFromProps: IFilter;
    onConfirm(filter: IFilter): void;
}

const ModalFilter = ({
    typePlace = TypePlace.FOOD,
    filterFromProps,
    defaultFilterObjectFromProps,
    onConfirm,
}: IProps) => {
    const [currentFilter, setCurrentFilter] = useState<IFilter>(filterFromProps);
    const modalize = ModalizeManager();

    useEffect(() => {
        if (!isEqual(filterFromProps, currentFilter)) {
            setCurrentFilter(filterFromProps);
        }
    }, [filterFromProps]);

    return (
        <View
            style={{
                backgroundColor: Themes.COLORS.white,
                width: Metrics.screenWidth,
                padding: 20,
            }}
        >
            <Row>
                <TextElement h3>Lọc kết quả</TextElement>

                <TouchableOpacity
                    style={iconButtonStyle}
                    onPress={() => {
                        modalize.dismiss('filter');
                    }}
                >
                    <Icon name="close" color="black" />
                </TouchableOpacity>
            </Row>
            <Space size="l" />
            <View>
                <ListItemTitle>Đã tới hay chưa?</ListItemTitle>
                <Row justify="center">
                    <CheckBox
                        style={iconButtonStyle}
                        onPress={() =>
                            setCurrentFilter({
                                ...currentFilter,
                                visited: undefined,
                            })
                        }
                        title="Cả 2"
                        checked={currentFilter?.visited === undefined}
                        checkedIcon={<Icon name="radio-button-checked" color={Themes.COLORS.primary} />}
                        uncheckedIcon={<Icon name="radio-button-unchecked" color={Themes.COLORS.primary} />}
                    />
                    <CheckBox
                        style={iconButtonStyle}
                        onPress={() =>
                            setCurrentFilter({
                                ...currentFilter,
                                visited: true,
                            })
                        }
                        title="Đã tới"
                        checked={currentFilter?.visited === true}
                        checkedIcon={<Icon name="radio-button-checked" color={Themes.COLORS.primary} />}
                        uncheckedIcon={<Icon name="radio-button-unchecked" color={Themes.COLORS.primary} />}
                    />
                    <CheckBox
                        style={iconButtonStyle}
                        onPress={() =>
                            setCurrentFilter({
                                ...currentFilter,
                                visited: false,
                            })
                        }
                        title="Chưa tới"
                        checked={currentFilter?.visited === false}
                        checkedIcon={<Icon name="radio-button-checked" color={Themes.COLORS.primary} />}
                        uncheckedIcon={<Icon name="radio-button-unchecked" color={Themes.COLORS.primary} />}
                    />
                </Row>
            </View>
            <Space size="l" />
            {typePlace === TypePlace?.FOOD ? (
                <View>
                    <ListItemTitle>Thể loại món ăn (cuộn xuống để xem thêm)</ListItemTitle>
                    <Space />
                    <View style={{ height: Metrics.screenHeight * 0.2, width: '100%' }}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <Row>
                                {currentFilter?.currentCategoriesArr?.map(cateItem => {
                                    return (
                                        <CheckBox
                                            key={cateItem?.name}
                                            style={iconButtonStyle}
                                            onPress={() => {
                                                setCurrentFilter({
                                                    ...currentFilter,
                                                    currentCategoriesArr: currentFilter?.currentCategoriesArr?.map(
                                                        item => {
                                                            if (item?.name === cateItem?.name) {
                                                                return {
                                                                    ...item,
                                                                    isChecked: !item?.isChecked,
                                                                };
                                                            }
                                                            return item;
                                                        },
                                                    ),
                                                });
                                            }}
                                            title={cateItem?.name}
                                            checked={cateItem?.isChecked}
                                            checkedIcon={<Icon name="check-box" color={Themes.COLORS.primary} />}
                                            uncheckedIcon={
                                                <Icon name="check-box-outline-blank" color={Themes.COLORS.primary} />
                                            }
                                        />
                                    );
                                })}
                            </Row>
                        </ScrollView>
                    </View>
                    <Space size="l" />
                    <Button
                        title={'Lọc'}
                        onPress={() => {
                            onConfirm(currentFilter);
                        }}
                    />
                    <Space size="l" />
                    <Button
                        type="outline"
                        onPress={() => {
                            setCurrentFilter(defaultFilterObjectFromProps);
                        }}
                        title={'Làm mới bộ lọc'}
                        icon={<Icon name="refresh" color="white" />}
                    />
                </View>
            ) : null}
        </View>
    );
};

export default ModalFilter;
