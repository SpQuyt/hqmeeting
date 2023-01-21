import { TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IPlace } from 'utilities/CommonInterface';
import Space from 'components/common/Space';
import Row from 'components/common/Row';
import { Themes } from 'assets/themes';
import { ListItem, Chip, AirbnbRating, Icon, Text, Card } from 'react-native-elements';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import { iconButtonStyle } from 'utilities/staticData';
import { renderAddressText } from 'utilities/helper';
import AlertMessage from 'components/base/AlertMessage';

interface IProps {
    item: IPlace;
    isCollapsedAllFromProps: boolean;
    onPress(item: IPlace): void;
    onDelete(item: IPlace): void;
    onEdit(item: IPlace): void;
}

const ItemPlace = ({ item, isCollapsedAllFromProps, onPress, onDelete, onEdit }: IProps) => {
    const [expanded, setExpanded] = useState(isCollapsedAllFromProps);

    // useEffect(() => {
    //     setExpanded(true);
    // }, [item]);

    useEffect(() => {
        if (isCollapsedAllFromProps !== expanded) {
            setExpanded(isCollapsedAllFromProps);
        }
    }, [isCollapsedAllFromProps]);

    return (
        <ListItem
            topDivider
            bottomDivider
            onPress={() => {
                onPress(item);
            }}
        >
            <ListItem.Content>
                <Row>
                    <View style={{ width: '70%' }}>
                        <ListItem.Title style={{ fontWeight: 'bold' }}>{item?.name}</ListItem.Title>
                    </View>
                    <Row fullWidth={false}>
                        <TouchableOpacity
                            style={iconButtonStyle}
                            onPress={() => {
                                onEdit(item);
                            }}
                        >
                            <Icon name="edit" color={Themes.COLORS.primary} />
                        </TouchableOpacity>
                        <Space size="l" />
                        <TouchableOpacity
                            style={iconButtonStyle}
                            onPress={() => {
                                AlertMessage('Bạn có chắc chắn muốn xoá?', '', () => {
                                    onDelete(item);
                                });
                            }}
                        >
                            <Icon name="delete" color={Themes.COLORS.borderInputError} />
                        </TouchableOpacity>
                    </Row>
                </Row>
                <Space />
                <Row justify="flex-start">
                    {item?.categories?.map((cateItem, cateIndex) => {
                        return (
                            <Chip
                                key={`${cateIndex}`}
                                title={cateItem}
                                type="outline"
                                containerStyle={{ marginLeft: cateIndex > 0 ? 10 : 0 }}
                            />
                        );
                    })}
                </Row>
                <Space />
                <ListItem.Subtitle>{renderAddressText(item)}</ListItem.Subtitle>
                <Space />
                <Row>
                    <AirbnbRating isDisabled showRating={false} count={5} defaultRating={item?.rating || 0} size={20} />
                    <Space size={'l'} />
                    {item?.visited && (
                        <Row fullWidth={false}>
                            <Icon name="done" color="green" />
                            <Icon name="done" color="green" />
                            <Space />
                            <Text style={{ color: Themes.COLORS.green }}>Đã tới</Text>
                        </Row>
                    )}
                </Row>
                <Space />
                <Row justify="flex-end">
                    <Text onPress={() => setExpanded(!expanded)} style={{ color: Themes.COLORS.primary }}>
                        {expanded ? 'Thu gọn' : 'Xem thêm'}
                    </Text>
                </Row>
                {expanded ? (
                    <Card containerStyle={{ width: '100%', alignSelf: 'center' }}>
                        <LinkPreview text={`${item?.link_video}`} />
                    </Card>
                ) : null}
            </ListItem.Content>
        </ListItem>
    );
};

export default ItemPlace;
