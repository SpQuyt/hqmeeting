import { TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IPlace } from 'utilities/CommonInterface';
import Space from 'components/common/Space';
import Row from 'components/common/Row';
import { Themes } from 'assets/themes';
import { ListItem, Chip, AirbnbRating, Icon, Text, Card } from 'react-native-elements';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import { iconButtonStyle } from 'utilities/staticData';
import { renderAddressText } from 'utilities/helper';

interface IProps {
    item: IPlace;
    onPress(item: IPlace): void;
}

const ItemPlace = ({ item, onPress }: IProps) => {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        setExpanded(false);
    }, [item]);

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
                    <ListItem.Title style={{ fontWeight: 'bold' }}>{item?.name}</ListItem.Title>
                    <Row fullWidth={false}>
                        <TouchableOpacity style={iconButtonStyle} onPress={() => {}}>
                            <Icon name="edit" color={Themes.COLORS.primary} />
                        </TouchableOpacity>
                        <Space size="l" />
                        <TouchableOpacity style={iconButtonStyle} onPress={() => {}}>
                            <Icon name="delete" color={Themes.COLORS.borderInputError} />
                        </TouchableOpacity>
                    </Row>
                </Row>
                <Space />
                <Row>
                    {item?.categories?.map((cateItem, cateIndex) => {
                        return <Chip key={`${cateIndex}`} title={cateItem} type="outline" />;
                    })}
                </Row>
                <Space />
                <ListItem.Subtitle>{renderAddressText(item)}</ListItem.Subtitle>
                <Space />
                <Row>
                    <AirbnbRating showRating={false} count={5} defaultRating={item?.rating || 0} size={20} />
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
                        Xem thêm
                    </Text>
                </Row>
                {expanded && (
                    <Card containerStyle={{ width: '100%', alignSelf: 'center' }}>
                        <LinkPreview text={`${item?.link_video}`} />
                    </Card>
                )}
            </ListItem.Content>
        </ListItem>
    );
};

export default ItemPlace;
