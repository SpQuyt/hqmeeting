import React, { FunctionComponent, useEffect } from 'react';
import { ActivityIndicator, LogBox, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from 'app-redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { loadLocaleLanguage } from 'utilities/i18next';
import { navigationRef } from 'navigation/NavigationService';
import Navigation from 'navigation/scene/RootScenes';
import { RootSiblingParent } from 'react-native-root-siblings';
import { addMenuClearAsyncStorage } from 'utilities/helper';
import codePush from 'react-native-code-push';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Config from 'react-native-config';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { Themes } from 'assets/themes';

LogBox.ignoreLogs(['Require cycle:', 'ViewPropTypes']);

if (__DEV__) {
    import('../ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

const App: FunctionComponent = () => {
    const theme = createTheme({
        lightColors: {
            primary: Themes.COLORS.primary,
        },
        darkColors: {
            primary: Themes.COLORS.primary,
        },
    });
    const onBeforeLift = () => {
        loadLocaleLanguage();
    };
    useEffect(() => {
        addMenuClearAsyncStorage();
        // if (!__DEV__) {
        codePush.sync({
            updateDialog: undefined,
            installMode: codePush.InstallMode.IMMEDIATE,
            deploymentKey:
                Platform.OS === 'android'
                    ? Config.CODEPUSH_ANDROID_DEVELOPMENT_KEY
                    : Config.CODEPUSH_IOS_DEVELOPMENT_KEY,
        });
        // }
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <PersistGate loading={<ActivityIndicator />} persistor={persistor} onBeforeLift={onBeforeLift}>
                        <RootSiblingParent>
                            <NavigationContainer ref={navigationRef}>
                                <Navigation />
                            </NavigationContainer>
                        </RootSiblingParent>
                    </PersistGate>
                </Provider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
};

export default App;
