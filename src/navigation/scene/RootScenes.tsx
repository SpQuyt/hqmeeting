import { firebase } from '@react-native-firebase/auth';
import { createStackNavigator } from '@react-navigation/stack';
import DetailsEatingScreen from 'feature/eating/DetailsEatingScreen';
import TruthOrDareScreen from 'feature/game/TruthOrDareScreen';
import React, { useEffect, useState } from 'react';
import { Host } from 'react-native-portalize';
import navigationConfigs from '../config/options';
import { APP_ROUTE, TAB_NAVIGATION_ROOT } from '../config/routes';
import AuthStack from './AuthScenes';
import MainTabContainer from './TabScenes';

export type RootStackParamList = Record<string, any>;

const MainStack = createStackNavigator<RootStackParamList>();

const AppStack = () => (
    <Host>
        <MainStack.Navigator screenOptions={navigationConfigs}>
            <MainStack.Screen name={APP_ROUTE.MAIN_TAB} component={MainTabContainer} />
            <MainStack.Screen name={TAB_NAVIGATION_ROOT.EATING_ROUTE.DETAILS} component={DetailsEatingScreen as any} />
            <MainStack.Screen
                name={TAB_NAVIGATION_ROOT.GAMING_ROUTE.TRUTH_OR_DARE}
                component={TruthOrDareScreen as any}
            />
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
