import { firebase } from '@react-native-firebase/auth';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Host } from 'react-native-portalize';
import navigationConfigs from '../config/options';
import { APP_ROUTE } from '../config/routes';
import AuthStack from './AuthScenes';
import MainTabContainer from './TabScenes';

export type RootStackParamList = Record<string, any>;

const MainStack = createStackNavigator<RootStackParamList>();

const AppStack = () => (
    <Host>
        <MainStack.Navigator screenOptions={navigationConfigs}>
            <MainStack.Screen name={APP_ROUTE.MAIN_TAB} component={MainTabContainer} />
        </MainStack.Navigator>
    </Host>
);

const Navigation: React.FunctionComponent = () => {
    const [currentUser, setCurrentUser] = useState<any>();

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            setCurrentUser(user || undefined);
        });
    });

    if (currentUser) {
        return <AppStack />;
    }
    return <AuthStack />;
};

export default Navigation;
