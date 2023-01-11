import firestore from '@react-native-firebase/firestore';
import { IPlace } from 'utilities/CommonInterface';
import { TypePlace } from 'utilities/enum';

export const getListEatAPI = async (): Promise<any> => {
    const querySnapshot = await firestore().collection('places').where('type', '==', TypePlace.FOOD).get();
    const dataArr: any = [];
    querySnapshot.forEach(snapshot => {
        const data = snapshot.data();
        dataArr.push({ ...data, id: snapshot.id });
    });
    return dataArr.sort((a: any, b: any) => a?.last_updated_at < b?.last_updated_at);
};

export const getListPlayAPI = async (): Promise<any> => {
    const querySnapshot = await firestore().collection('places').where('type', '==', TypePlace.PLAY).get();
    const dataArr: any = [];
    querySnapshot.forEach(snapshot => {
        const data = snapshot.data();
        dataArr.push({ ...data, id: snapshot.id });
    });
    return dataArr;
};

export const createPlaceAPI = async (data: IPlace): Promise<any> => {
    await firestore().collection('places').add(data);
};

export const deletePlaceAPI = async (id: string): Promise<any> => {
    await firestore().collection('places').doc(id).delete();
};

export const getListCategoriesAPI = async (): Promise<any> => {
    const querySnapshot = await firestore().collection('categories').orderBy('name').get();
    const dataArr: any = [];
    querySnapshot.forEach(snapshot => {
        const data = snapshot.data();
        dataArr.push({ ...data, id: snapshot.id });
    });
    return dataArr;
};
