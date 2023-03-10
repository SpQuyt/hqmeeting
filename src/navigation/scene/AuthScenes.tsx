import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from 'feature/authentication/LoginScreen';
import navigationConfigs from 'navigation/config/options';
import { AUTHENTICATE_ROUTE } from 'navigation/config/routes';
import React from 'react';
import { RootStackParamList } from './RootScenes';

const MainStack = createStackNavigator<RootStackParamList>();

const AuthStack = () => (
    <MainStack.Navigator screenOptions={navigationConfigs}>
        <MainStack.Screen name={AUTHENTICATE_ROUTE.LOGIN} component={LoginScreen} />
    </MainStack.Navigator>
);

export default AuthStack;
