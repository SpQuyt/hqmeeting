import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Themes } from 'assets/themes';
import Row from 'components/common/Row';
import { Header, Icon } from 'react-native-elements';
import { TextElement } from 'react-native-elements/dist/text/Text';
import { titleHeaderStyle, iconButtonStyle } from 'utilities/staticData';
import { goBack } from 'navigation/NavigationService';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import { IPlace } from 'utilities/CommonInterface';
import Space from 'components/common/Space';
import { renderAddressText } from 'utilities/helper';
import MapView, { Marker } from 'react-native-maps';
import Metrics from 'assets/metrics';

interface IProps {
    route: {
        params: {
            itemFromRoute: IPlace;
        };
    };
}

const DetailsEatingScreen = ({ route }: IProps) => {
    const itemFromRoute = route?.params?.itemFromRoute;
    return (
        <View style={styles.container}>
            <Header
                backgroundColor={Themes.COLORS.primary}
                leftComponent={
                    <Row fullWidth={false}>
                        <TouchableOpacity
                            style={iconButtonStyle}
                            onPress={() => {
                                goBack();
                            }}
                        >
                            <Icon name="arrow-back" color={Themes.COLORS.white} />
                        </TouchableOpacity>
                    </Row>
                }
                centerComponent={
                    <TextElement h4 h4Style={titleHeaderStyle}>
                        {itemFromRoute?.name}
                    </TextElement>
                }
                rightComponent={
                    <Row fullWidth={false}>
                        <TouchableOpacity style={iconButtonStyle} onPress={() => {}}>
                            <Icon name="edit" color={Themes.COLORS.white} />
                        </TouchableOpacity>
                        <TouchableOpacity style={iconButtonStyle} onPress={() => {}}>
                            <Icon name="delete" color={Themes.COLORS.white} />
                        </TouchableOpacity>
                    </Row>
                }
            />
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.containerScroll}>
                    <TextElement h4 h4Style={{ fontWeight: 'bold' }}>
                        Video / Ảnh
                    </TextElement>
                    <LinkPreview text={`${itemFromRoute?.link_video}`} />
                    <Space size="l" />
                    <Space size="l" />
                    <TextElement h4 h4Style={{ fontWeight: 'bold' }}>
                        Địa chỉ
                    </TextElement>
                    <TextElement>{renderAddressText(itemFromRoute)}</TextElement>
                    <MapView
                        style={{ height: Metrics.screenHeight * 0.3, width: '100%' }}
                        provider="google"
                        initialRegion={{
                            latitude: itemFromRoute?.lat || 0,
                            longitude: itemFromRoute?.lng || 0,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.08,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: itemFromRoute?.lat || 0,
                                longitude: itemFromRoute?.lng || 0,
                            }}
                            title={itemFromRoute?.name}
                        />
                    </MapView>
                </ScrollView>
            </View>
        </View>
    );
};

export default DetailsEatingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerScroll: {
        padding: 20,
    },
});
