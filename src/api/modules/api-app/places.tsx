import firestore from '@react-native-firebase/firestore';
import { TypePlace } from 'utilities/enum';

export const getListEatAPI = async (): Promise<any> => {
    const querySnapshot = await firestore().collection('places').where('type', '==', TypePlace.FOOD).get();
    const dataArr: any = [];
    querySnapshot.forEach(snapshot => {
        const data = snapshot.data();
        dataArr.push(data);
    });
    return dataArr;
};
export const getListPlayAPI = async (): Promise<any> => {
    const querySnapshot = await firestore().collection('places').where('type', '==', TypePlace.PLAY).get();
    const dataArr: any = [];
    querySnapshot.forEach(snapshot => {
        const data = snapshot.data();
        dataArr.push(data);
    });
    return dataArr;
};
