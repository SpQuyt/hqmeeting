/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-restricted-syntax */
import { ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Metrics from 'assets/metrics';
import { AirbnbRating, Button, CheckBox, Icon, Input } from 'react-native-elements';
import { TextElement } from 'react-native-elements/dist/text/Text';
import { iconButtonStyle } from 'utilities/staticData';
import ModalizeManager from 'components/base/modal/ModalizeManager';
import { TypePlace } from 'utilities/enum';
import { Themes } from 'assets/themes';
import { IPlace } from 'utilities/CommonInterface';
import AlertMessage from 'components/base/AlertMessage';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import Row from './Row';
import Space from './Space';

interface IProps {
    categoriesArrFromProps: Array<{ name: string; isChecked: boolean }>;
    dataFromEdit?: IPlace;
    onConfirm(data: IPlace): void;
}

const ModalFormAddPlaces = ({ onConfirm, categoriesArrFromProps, dataFromEdit }: IProps) => {
    const modalize = ModalizeManager();
    const [data, setData] = useState<IPlace>({
        name: '',
        lat: 0,
        lng: 0,
        house_number: '',
        alley: '',
        lane: '',
        road: '',
        district: '',
        city: '',
        link_video: '',
        visited: false,
        false_place: false,
        rating: 0,
        categories: [],
        type: TypePlace.FOOD,
    });
    const [currentCategoriesArr, setCurrentCategoriesArr] = useState<
        Array<{
            name: string;
            isChecked: boolean;
        }>
    >(categoriesArrFromProps);

    useEffect(() => {
        if (data?.categories && data?.categories?.length > 0) {
            let newCateGoriesArr = [...categoriesArrFromProps];
            for (const cateNameItem of data?.categories) {
                newCateGoriesArr = newCateGoriesArr.map(newItem => {
                    if (cateNameItem === newItem?.name) {
                        return {
                            ...newItem,
                            isChecked: true,
                        };
                    }
                    return newItem;
                });
            }
            setCurrentCategoriesArr(newCateGoriesArr);
            return;
        }
        if (!isEqual(categoriesArrFromProps, currentCategoriesArr)) {
            setCurrentCategoriesArr(categoriesArrFromProps);
        }
    }, [categoriesArrFromProps, data?.categories]);

    useEffect(() => {
        if (dataFromEdit && !isEqual(dataFromEdit, data)) {
            setData(dataFromEdit);
        }
    }, [dataFromEdit]);

    return (
        <View style={{ height: Metrics.screenHeight * 0.9, padding: 10 }}>
            <Row>
                <TextElement h3>Thêm địa điểm</TextElement>
                <TouchableOpacity
                    style={iconButtonStyle}
                    onPress={() => {
                        modalize.dismiss('addEditFood');
                    }}
                >
                    <Icon name="close" color="black" />
                </TouchableOpacity>
            </Row>
            <Space size="l" />
            <Row justify="flex-end">
                <TextElement style={{ fontStyle: 'italic' }}>* là trường bắt buộc phải điền / chọn</TextElement>
            </Row>
            <Space size="l" />
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <TextElement style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>
                    Loại địa điểm (*)
                </TextElement>
                <Row justify="center">
                    <CheckBox
                        style={iconButtonStyle}
                        onPress={() =>
                            setData({
                                ...data,
                                type: TypePlace.FOOD,
                            })
                        }
                        title="Ăn uống"
                        checked={data?.type === TypePlace.FOOD}
                        checkedIcon={<Icon name="radio-button-checked" color={Themes.COLORS.primary} />}
                        uncheckedIcon={<Icon name="radio-button-unchecked" color={Themes.COLORS.primary} />}
                    />
                    <CheckBox
                        style={iconButtonStyle}
                        onPress={() =>
                            setData({
                                ...data,
                                type: TypePlace.PLAY,
                            })
                        }
                        title="Vui chơi"
                        checked={data?.type === TypePlace.PLAY}
                        checkedIcon={<Icon name="radio-button-checked" color={Themes.COLORS.primary} />}
                        uncheckedIcon={<Icon name="radio-button-unchecked" color={Themes.COLORS.primary} />}
                    />
                </Row>
                <Input
                    label="Tên địa điểm (*)"
                    value={data?.name}
                    onChangeText={text => {
                        setData({ ...data, name: text });
                    }}
                    labelStyle={{ color: Themes.COLORS.black }}
                />
                <Input
                    label="Link video (*)"
                    value={data?.link_video}
                    onChangeText={text => {
                        setData({ ...data, link_video: text });
                    }}
                    labelStyle={{ color: Themes.COLORS.black }}
                />
                <Input
                    label="Địa chỉ (*)"
                    value={data?.road}
                    onChangeText={text => {
                        setData({ ...data, road: text });
                    }}
                    labelStyle={{ color: Themes.COLORS.black }}
                />
                <View>
                    <TextElement style={{ marginLeft: 10, fontSize: 16, fontWeight: '700' }}>
                        Đã tới hay chưa (*)
                    </TextElement>
                    <Row justify="center">
                        <CheckBox
                            onPress={() =>
                                setData({
                                    ...data,
                                    visited: true,
                                })
                            }
                            title="Đã tới"
                            checked={data?.visited === true}
                            checkedIcon={<Icon name="radio-button-checked" color={Themes.COLORS.primary} />}
                            uncheckedIcon={<Icon name="radio-button-unchecked" color={Themes.COLORS.primary} />}
                        />
                        <CheckBox
                            onPress={() =>
                                setData({
                                    ...data,
                                    visited: false,
                                })
                            }
                            title="Chưa tới"
                            checked={data?.visited === false}
                            checkedIcon={<Icon name="radio-button-checked" color={Themes.COLORS.primary} />}
                            uncheckedIcon={<Icon name="radio-button-unchecked" color={Themes.COLORS.primary} />}
                        />
                    </Row>
                    <Space size="l" />
                </View>
                <View>
                    <TextElement style={{ marginLeft: 10, fontSize: 16, fontWeight: '700' }}>Đánh giá</TextElement>
                    <Space />
                    <Row justify="flex-start">
                        <Space />
                        <AirbnbRating
                            showRating={false}
                            count={5}
                            defaultRating={data?.rating || 0}
                            size={40}
                            onFinishRating={result => {
                                setData({
                                    ...data,
                                    rating: result,
                                });
                            }}
                        />
                    </Row>
                    <Space size="l" />
                    <Space size="l" />
                </View>
                {data?.type === TypePlace?.FOOD ? (
                    <View>
                        <TextElement style={{ marginLeft: 10, fontSize: 16, fontWeight: '700' }}>
                            Thể loại món ăn (*)
                        </TextElement>
                        <Space />
                        <Row justify="flex-start">
                            {currentCategoriesArr?.map(cateItem => {
                                return (
                                    <CheckBox
                                        key={cateItem?.name}
                                        style={iconButtonStyle}
                                        onPress={() => {
                                            setCurrentCategoriesArr(
                                                currentCategoriesArr?.map(item => {
                                                    if (item?.name === cateItem?.name) {
                                                        return {
                                                            ...item,
                                                            isChecked: !item?.isChecked,
                                                        };
                                                    }
                                                    return item;
                                                }),
                                            );
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
                        <Space size="l" />
                    </View>
                ) : null}
                <Button
                    title={dataFromEdit ? 'Chỉnh sửa' : 'Tạo mới'}
                    onPress={() => {
                        const cateChosenArr = currentCategoriesArr?.filter(item => item?.isChecked);
                        if (data?.name && data?.link_video && data?.road && cateChosenArr?.length > 0) {
                            onConfirm({
                                ...data,
                                categories: cateChosenArr?.map(item => item?.name),
                                created_at: dataFromEdit ? data?.created_at : Number(dayjs().unix()),
                                last_updated_at: Number(dayjs().unix()),
                            });
                            return;
                        }
                        AlertMessage('Xin hãy điền hết thông tin yêu cầu!');
                    }}
                />
            </ScrollView>
        </View>
    );
};

export default ModalFormAddPlaces;
