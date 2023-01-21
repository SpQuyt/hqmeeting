/* eslint-disable no-plusplus */
import firestore from '@react-native-firebase/firestore';
import { IFilter, IPlace } from 'utilities/CommonInterface';
import { TypePlace } from 'utilities/enum';
import { toNonAccentVietnamese } from 'utilities/helper';

export const getListEatAPI = async (filter: IFilter): Promise<any> => {
    const queryText = firestore().collection('places').where('type', '==', TypePlace.FOOD);
    const querySnapshot = await queryText.get();
    const dataArr: any = [];
    let dataArrWithFilter = dataArr;
    querySnapshot.forEach(snapshot => {
        const data = snapshot.data();
        dataArr.push({ ...data, id: snapshot.id });
    });
    if (filter?.keyword) {
        dataArrWithFilter = dataArrWithFilter.filter((dataItem: any) => {
            const processName = toNonAccentVietnamese(dataItem?.name?.toLowerCase());
            const processKeyword = toNonAccentVietnamese(filter?.keyword?.toLowerCase());
            return processName.includes(processKeyword);
        });
    }
    if (filter?.visited !== undefined) {
        dataArrWithFilter = dataArrWithFilter.filter((dataItem: any) => {
            return dataItem?.visited === filter?.visited;
        });
    }
    const categoriesFromParamsArr = filter?.currentCategoriesArr
        ?.filter(item => item?.isChecked)
        ?.map(item => item?.name);
    if (categoriesFromParamsArr && categoriesFromParamsArr?.length > 0) {
        dataArrWithFilter = dataArrWithFilter.filter((dataItem: any) => {
            let countCateItemToCheck = 0;
            for (let cateIndex = 0; cateIndex < categoriesFromParamsArr?.length; cateIndex++) {
                if (dataItem?.categories?.includes(categoriesFromParamsArr[cateIndex])) {
                    countCateItemToCheck += 1;
                }
            }
            return countCateItemToCheck === categoriesFromParamsArr?.length;
        });
    }
    return dataArrWithFilter.sort((a: any, b: any) => a?.last_updated_at < b?.last_updated_at);
};

export const getListPlayAPI = async (filter: IFilter): Promise<any> => {
    const querySnapshot = await firestore().collection('places').where('type', '==', TypePlace.PLAY).get();
    const dataArr: any = [];
    let dataArrWithFilter = dataArr;
    querySnapshot.forEach(snapshot => {
        const data = snapshot.data();
        dataArr.push({ ...data, id: snapshot.id });
    });
    if (filter?.keyword) {
        dataArrWithFilter = dataArrWithFilter.filter((dataItem: any) => {
            const processName = toNonAccentVietnamese(dataItem?.name?.toLowerCase());
            const processKeyword = toNonAccentVietnamese(filter?.keyword?.toLowerCase());
            return processName.includes(processKeyword);
        });
    }
    if (filter?.visited !== undefined) {
        dataArrWithFilter = dataArrWithFilter.filter((dataItem: any) => {
            return dataItem?.visited === filter?.visited;
        });
    }
    const categoriesFromParamsArr = filter?.currentCategoriesArr
        ?.filter(item => item?.isChecked)
        ?.map(item => item?.name);
    if (categoriesFromParamsArr && categoriesFromParamsArr?.length > 0) {
        dataArrWithFilter = dataArrWithFilter.filter((dataItem: any) => {
            let countCateItemToCheck = 0;
            for (let cateIndex = 0; cateIndex < categoriesFromParamsArr?.length; cateIndex++) {
                if (dataItem?.categories?.includes(categoriesFromParamsArr[cateIndex])) {
                    countCateItemToCheck += 1;
                }
            }
            return countCateItemToCheck === categoriesFromParamsArr?.length;
        });
    }
    return dataArrWithFilter.sort((a: any, b: any) => a?.last_updated_at < b?.last_updated_at);
};

export const createPlaceAPI = async (data: IPlace): Promise<any> => {
    await firestore().collection('places').add(data);
};

export const editPlaceAPI = async (data: IPlace): Promise<any> => {
    const newData = { ...data };
    delete newData?.id;
    await firestore().collection('places').doc(data?.id).set(newData);
};

export const deletePlaceAPI = async (id: string): Promise<any> => {
    await firestore().collection('places').doc(id).delete();
};

export const getListCategoriesEatAPI = async (): Promise<any> => {
    const querySnapshot = await firestore()
        .collection('categories')
        .orderBy('name')
        .where('type', '==', TypePlace.FOOD)
        .get();
    const dataArr: any = [];
    querySnapshot.forEach(snapshot => {
        const data = snapshot.data();
        dataArr.push({ ...data, id: snapshot.id });
    });
    return dataArr;
};

export const getListCategoriesPlayAPI = async (): Promise<any> => {
    const querySnapshot = await firestore()
        .collection('categories')
        .orderBy('name')
        .where('type', '==', TypePlace.PLAY)
        .get();
    const dataArr: any = [];
    querySnapshot.forEach(snapshot => {
        const data = snapshot.data();
        dataArr.push({ ...data, id: snapshot.id });
    });
    console.log('dataArr', dataArr);
    return dataArr;
};
