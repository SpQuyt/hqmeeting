/* eslint-disable no-plusplus */
import firestore from '@react-native-firebase/firestore';

export const getListTruthsDaresAPI = async (): Promise<any> => {
    const truthSnapshot = await firestore().collection('truths').get();
    const dareSnapshot = await firestore().collection('dares').get();
    const truthsArrNotShuffle: Array<any> = [];
    const daresArrNotShuffle: Array<any> = [];
    truthSnapshot.forEach(snapshot => {
        const data = snapshot.data();
        truthsArrNotShuffle.push({ ...data, id: snapshot.id });
    });
    dareSnapshot.forEach(snapshot => {
        const data = snapshot.data();
        daresArrNotShuffle.push({ ...data, id: snapshot.id });
    });
    return {
        truthsArr: truthsArrNotShuffle.sort(() => 0.5 - Math.random()),
        daresArr: daresArrNotShuffle.sort(() => 0.5 - Math.random()),
    };
};

export const createTruthsAPI = async (data: { name: string; isUsed: boolean }): Promise<any> => {
    await firestore().collection('truths').add(data);
};

export const editTruthsAPI = async (data: { id: string; name: string; isUsed: boolean }): Promise<any> => {
    const newData: any = { ...data };
    delete newData?.id;
    await firestore().collection('truths').doc(data?.id).set(newData);
};

export const createDaresAPI = async (data: { name: string; isUsed: boolean }): Promise<any> => {
    await firestore().collection('dares').add(data);
};

export const editDaresAPI = async (data: { id: string; name: string; isUsed: boolean }): Promise<any> => {
    const newData: any = { ...data };
    delete newData?.id;
    await firestore().collection('dares').doc(data?.id).set(newData);
};
