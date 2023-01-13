/* eslint-disable no-plusplus */
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Themes } from 'assets/themes';
import { Header, Icon } from 'react-native-elements';
import { TextElement } from 'react-native-elements/dist/text/Text';
import { iconButtonStyle, titleHeaderStyle } from 'utilities/staticData';
import { goBack } from 'navigation/NavigationService';
import Images from 'assets/images';
import Metrics from 'assets/metrics';
import { ListItemTitle } from '@rneui/base/dist/ListItem/ListItem.Title';
import Space from 'components/common/Space';
import { useIsFocused } from '@react-navigation/native';
import AlertMessage from 'components/base/AlertMessage';
import StyledOverlayLoading from 'components/base/StyledOverlayLoading';
import { getListTruthsDaresAPI } from 'api/modules/api-app/game';
import Swiper from 'react-native-deck-swiper';

interface IResponse {
    truthsArr: Array<{
        name: string;
        id: number;
    }>;
    daresArr: Array<{
        name: string;
        id: number;
    }>;
}

interface IGameItem {
    truth: {
        name: string;
        id: number;
    };
    dare: {
        name: string;
        id: number;
    };
}

const TruthOrDareScreen = () => {
    const sourceArrSuffix = [
        Images.photo.cardTemplate,
        Images.photo.cardTemplate2,
        Images.photo.cardTemplate3,
        Images.photo.cardTemplate4,
    ];
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);
    const [curTruthsDaresList, setCurTruthsDaresList] = useState<IResponse | undefined>();

    const handleTruthsDaresData = (unprocessData?: IResponse) => {
        if (!unprocessData) return [];
        const dataArr = [];
        let minNumber = unprocessData?.daresArr?.length;
        if (unprocessData?.truthsArr?.length < minNumber) {
            minNumber = unprocessData?.truthsArr?.length;
        }
        for (let numberIndex = 0; numberIndex < minNumber; numberIndex++) {
            dataArr.push({
                truth: unprocessData?.truthsArr[numberIndex],
                dare: unprocessData?.daresArr[numberIndex],
            });
        }
        return dataArr;
    };

    const getListTruthsDares = async () => {
        try {
            setIsLoading(true);
            const resultTruthsDares = await getListTruthsDaresAPI();
            setCurTruthsDaresList(resultTruthsDares);
        } catch (err) {
            console.log(err);
            AlertMessage(`${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            getListTruthsDares();
        }
    }, [isFocused]);

    return (
        <View>
            <StyledOverlayLoading visible={isLoading} />
            <Header
                backgroundColor={Themes.COLORS.primary}
                leftComponent={
                    <TouchableOpacity
                        style={iconButtonStyle}
                        onPress={() => {
                            goBack();
                        }}
                    >
                        <Icon name="arrow-back" color={Themes.COLORS.white} />
                    </TouchableOpacity>
                }
                centerComponent={
                    <TextElement h4 h4Style={titleHeaderStyle}>
                        Truth Or Dare
                    </TextElement>
                }
                rightComponent={
                    <TouchableOpacity
                        style={iconButtonStyle}
                        onPress={() => {
                            setCurTruthsDaresList(undefined);
                            getListTruthsDares();
                        }}
                    >
                        <Icon name="refresh" color={Themes.COLORS.white} />
                    </TouchableOpacity>
                }
            />
            <View style={styles.contScreen}>
                {curTruthsDaresList ? (
                    <Swiper
                        cards={handleTruthsDaresData(curTruthsDaresList)}
                        renderCard={(card: IGameItem) => {
                            // const randomNumber = getRandomIntInclusive(0, sourceArrSuffix?.length);
                            const randomNumber = 0;
                            return (
                                <View style={styles.contCard}>
                                    <ImageBackground source={sourceArrSuffix[randomNumber]} style={styles.imgContCard}>
                                        <View style={styles.contTxtContent}>
                                            <ListItemTitle style={titleHeaderStyle}>Truth: </ListItemTitle>
                                            <Space />
                                            <ListItemTitle style={[titleHeaderStyle, styles.txtContentCard]}>
                                                {card?.truth?.name}
                                            </ListItemTitle>

                                            <Space size="l" />
                                            <Space size="l" />

                                            <ListItemTitle style={titleHeaderStyle}>Dare: </ListItemTitle>
                                            <Space />
                                            <ListItemTitle style={[titleHeaderStyle, styles.txtContentCard]}>
                                                {card?.dare?.name}
                                            </ListItemTitle>
                                        </View>
                                    </ImageBackground>
                                </View>
                            );
                        }}
                        onSwiped={cardIndex => {
                            console.log(cardIndex);
                        }}
                        onSwipedAll={() => {
                            console.log('onSwipedAll');
                        }}
                        cardIndex={0}
                        stackSize={3}
                        cardStyle={{ marginTop: -50 }}
                        backgroundColor={Themes.COLORS.white}
                    />
                ) : null}
            </View>
        </View>
    );
};

export default TruthOrDareScreen;

const styles = StyleSheet.create({
    contScreen: {
        flex: 1,
        alignItems: 'center',
    },
    contCard: {
        height: Metrics.screenHeight * 0.8,
        width: Metrics.screenWidth * 0.9,
        borderRadius: 30,
        overflow: 'hidden',
    },
    imgContCard: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contTxtContent: {
        maxWidth: '80%',
        maxHeight: '70%',
    },
    txtContentCard: {
        fontWeight: 'normal',
        fontStyle: 'italic',
    },

    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    card: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    text: {
        textAlign: 'center',
        fontSize: 50,
        backgroundColor: 'transparent',
    },
});
