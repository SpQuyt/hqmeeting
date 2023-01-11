import { ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Metrics from 'assets/metrics';
import { Button, CheckBox, Icon, Input } from 'react-native-elements';
import { TextElement } from 'react-native-elements/dist/text/Text';
import { iconButtonStyle } from 'utilities/staticData';
import ModalizeManager from 'components/base/modal/ModalizeManager';
import { TypePlace } from 'utilities/enum';
import { Themes } from 'assets/themes';
import { IPlace } from 'utilities/CommonInterface';
import AlertMessage from 'components/base/AlertMessage';
import { getListCategoriesAPI } from 'api/modules/api-app/places';
import StyledOverlayLoading from 'components/base/StyledOverlayLoading';
import dayjs from 'dayjs';
import Row from './Row';
import Space from './Space';

interface IProps {
    onConfirm(data: IPlace): void;
}

const ModalFormAddPlaces = ({ onConfirm }: IProps) => {
    const modalize = ModalizeManager();
    const [isLoading, setIsLoading] = useState(false);
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
    >([]);

    const getCategories = async () => {
        try {
            setIsLoading(true);
            const result = await getListCategoriesAPI();
            setCurrentCategoriesArr(
                result?.map((resItem: any) => {
                    return {
                        name: resItem?.name,
                        isChecked: false,
                    };
                }),
            );
        } catch (err) {
            AlertMessage(`${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <View style={{ height: Metrics.screenHeight * 0.9, padding: 10 }}>
            <ScrollView>
                <StyledOverlayLoading visible={isLoading} />
                <Row>
                    <TextElement h1>Thêm địa điểm</TextElement>
                    <TouchableOpacity
                        style={iconButtonStyle}
                        onPress={() => {
                            modalize.dismiss('addFood');
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
                />
                <Input
                    label="Link video (*)"
                    value={data?.link_video}
                    onChangeText={text => {
                        setData({ ...data, link_video: text });
                    }}
                />
                <Input
                    label="Địa chỉ (*)"
                    value={data?.road}
                    onChangeText={text => {
                        setData({ ...data, road: text });
                    }}
                />
                {data?.type === TypePlace?.FOOD ? (
                    <View>
                        <TextElement style={{ marginLeft: 10, fontSize: 16, fontWeight: '700' }}>
                            Thể loại món ăn (*)
                        </TextElement>
                        <Space />
                        <Row>
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
                    title={'Tạo mới'}
                    onPress={() => {
                        const cateChosenArr = currentCategoriesArr?.filter(item => item?.isChecked);
                        if (data?.name && data?.link_video && data?.road && cateChosenArr?.length > 0) {
                            onConfirm({
                                ...data,
                                categories: cateChosenArr?.map(item => item?.name),
                                created_at: Number(dayjs().unix()),
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
