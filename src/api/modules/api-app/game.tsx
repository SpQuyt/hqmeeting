/* eslint-disable no-plusplus */
import firestore from '@react-native-firebase/firestore';

export const getListTruthsDaresAPI = async (): Promise<any> => {
    const truthSnapshot = await firestore().collection('truths').get();
    const dareSnapshot = await firestore().collection('dares').get();
    const truthsArr: Array<any> = [];
    const daresArr: Array<any> = [];
    truthSnapshot.forEach(snapshot => {
        const data = snapshot.data();
        truthsArr.push({ ...data, id: snapshot.id });
    });
    dareSnapshot.forEach(snapshot => {
        const data = snapshot.data();
        daresArr.push({ ...data, id: snapshot.id });
    });
    return {
        truthsArr,
        daresArr,
    };
};
