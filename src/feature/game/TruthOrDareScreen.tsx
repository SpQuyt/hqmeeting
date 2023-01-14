/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import { ImageBackground, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import {
    createDaresAPI,
    createTruthsAPI,
    editDaresAPI,
    editTruthsAPI,
    getListTruthsDaresAPI,
} from 'api/modules/api-app/game';
import Swiper from 'react-native-deck-swiper';
import { getRandomIntInclusive } from 'utilities/helper';
import FloatingButton from 'components/common/FloatingButton';
import { Truths } from 'utilities/gameData/truths';
import { Dares } from 'utilities/gameData/dares';

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
    image: ImageSourcePropType;
    textColorObj: {
        color: string;
    };
}

const TruthOrDareScreen = () => {
    const sourceArrSuffix = [
        {
            image: Images.photo.cardTemplate,
            textColor: Themes.COLORS.white,
        },
        {
            image: Images.photo.cardTemplate2,
            textColor: Themes.COLORS.black,
        },
        {
            image: Images.photo.cardTemplate3,
            textColor: Themes.COLORS.black,
        },
        {
            image: Images.photo.cardTemplate4,
            textColor: Themes.COLORS.white,
        },
    ];
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);
    const [curTruthsDaresList, setCurTruthsDaresList] = useState<IResponse | undefined>();
    const [curGameData, setCurGameData] = useState<Array<IGameItem>>([]);
    const [curCardNumber, setCurCardNumber] = useState<number>(0);

    const handleTruthsDaresData = (unprocessData?: IResponse) => {
        if (!unprocessData) return [];
        const dataArr: Array<IGameItem> = [];
        let maxNumber = unprocessData?.daresArr?.length;
        if (unprocessData?.truthsArr?.length > maxNumber) {
            maxNumber = unprocessData?.truthsArr?.length;
        }
        for (let numberIndex = 0; numberIndex < maxNumber; numberIndex++) {
            const imageIndex = getRandomIntInclusive(0, (sourceArrSuffix?.length || 1) - 1);
            const truthIndex =
                unprocessData?.truthsArr[numberIndex] === undefined
                    ? getRandomIntInclusive(0, (unprocessData?.truthsArr?.length || 1) - 1)
                    : numberIndex;
            const dareIndex =
                unprocessData?.daresArr[numberIndex] === undefined
                    ? getRandomIntInclusive(0, (unprocessData?.daresArr?.length || 1) - 1)
                    : numberIndex;
            dataArr.push({
                truth: unprocessData?.truthsArr[truthIndex],
                dare: unprocessData?.daresArr[dareIndex],
                image: sourceArrSuffix[imageIndex]?.image,
                textColorObj: { color: sourceArrSuffix[imageIndex]?.textColor },
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

    const updateListDatabase = async ({
        resultArr,
        staticData,
        apiCreate,
        apiUpdate,
    }: {
        resultArr: Array<any>;
        staticData: Array<any>;
        apiCreate: any;
        apiUpdate: any;
    }) => {
        const arr = resultArr?.map((item: any) => item?.name);
        for (const dataItem of staticData) {
            if (!arr.includes(dataItem)) {
                await apiCreate({
                    name: dataItem,
                    isUsed: false,
                });
            } else if (arr.includes(dataItem) && resultArr?.[arr?.indexOf(dataItem)]?.isUsed === undefined) {
                await apiUpdate({
                    id: resultArr?.[arr?.indexOf(dataItem)]?.id,
                    name: dataItem,
                    isUsed: false,
                });
            } else {
                // Do nothing here
            }
        }
    };

    useEffect(() => {
        if (isFocused) {
            getListTruthsDares();
        }
    }, [isFocused]);

    useEffect(() => {
        const newGameData = handleTruthsDaresData(curTruthsDaresList);
        setCurGameData(newGameData);
        setCurCardNumber(newGameData?.length || 0);
    }, [curTruthsDaresList]);

    return (
        <View style={{ flex: 1 }}>
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
                            AlertMessage('Bạn có chắc chắn muốn tạo bộ bài mới không?', '', () => {
                                setCurTruthsDaresList(undefined);
                                getListTruthsDares();
                            });
                        }}
                    >
                        <Icon name="refresh" color={Themes.COLORS.white} />
                    </TouchableOpacity>
                }
            />
            <View style={styles.contScreen}>
                <ListItemTitle style={styles.contCount}>
                    {curCardNumber} / {curGameData?.length || 0}
                </ListItemTitle>
                {curTruthsDaresList ? (
                    <Swiper
                        cards={curGameData}
                        renderCard={(card: IGameItem) => {
                            return (
                                <View style={styles.contCard}>
                                    <ImageBackground source={card?.image} style={styles.imgContCard}>
                                        <View style={styles.contTxtContent}>
                                            <ListItemTitle style={[titleHeaderStyle, card?.textColorObj]}>
                                                Truth:{' '}
                                            </ListItemTitle>
                                            <Space />
                                            <ListItemTitle
                                                style={[titleHeaderStyle, styles.txtContentCard, card?.textColorObj]}
                                            >
                                                {card?.truth?.name}
                                            </ListItemTitle>

                                            <Space size="l" />
                                            <Space size="l" />

                                            <ListItemTitle style={[titleHeaderStyle, card?.textColorObj]}>
                                                Dare:{' '}
                                            </ListItemTitle>
                                            <Space />
                                            <ListItemTitle
                                                style={[titleHeaderStyle, styles.txtContentCard, card?.textColorObj]}
                                            >
                                                {card?.dare?.name}
                                            </ListItemTitle>
                                        </View>
                                    </ImageBackground>
                                </View>
                            );
                        }}
                        onSwiped={() => {
                            setCurCardNumber(curCardNumber - 1);
                        }}
                        onSwipedAll={() => {
                            AlertMessage(
                                'Đã hết bộ bài. Bạn có muốn tạo bộ bài mới không?',
                                '',
                                () => {
                                    setCurTruthsDaresList(undefined);
                                    getListTruthsDares();
                                },
                                true,
                            );
                        }}
                        cardIndex={0}
                        stackSize={3}
                        cardStyle={{ marginTop: -50 }}
                        backgroundColor={Themes.COLORS.white}
                    />
                ) : null}
            </View>
            {__DEV__ ? (
                <View style={{ marginBottom: 40 }}>
                    <FloatingButton
                        onPress={async () => {
                            try {
                                setIsLoading(true);
                                const resultTruthsDares = await getListTruthsDaresAPI();
                                // Truths
                                await updateListDatabase({
                                    resultArr: resultTruthsDares?.truthsArr,
                                    staticData: Truths,
                                    apiCreate: createTruthsAPI,
                                    apiUpdate: editTruthsAPI,
                                });

                                // Dares
                                await updateListDatabase({
                                    resultArr: resultTruthsDares?.daresArr,
                                    staticData: Dares,
                                    apiCreate: createDaresAPI,
                                    apiUpdate: editDaresAPI,
                                });
                            } catch (err) {
                                console.log(err);
                                AlertMessage(`${err}`);
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                    />
                </View>
            ) : null}
        </View>
    );
};

export default TruthOrDareScreen;

const styles = StyleSheet.create({
    contScreen: {
        flex: 1,
        alignItems: 'center',
        position: 'relative',
    },
    contCount: {
        position: 'absolute',
        zIndex: 1,
        borderWidth: 1,
        padding: 10,
        backgroundColor: Themes.COLORS.primary,
        left: 0,
        color: Themes.COLORS.white,
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
