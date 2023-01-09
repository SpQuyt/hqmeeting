import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ListEatingScreen from 'feature/eating/ListEatingScreen';
import ListPlanningScreen from 'feature/planning/ListPlanningScreen';
import ListPlayingScreen from 'feature/playing/ListPlayingScreen';
import SettingScreen from 'feature/setting/SettingScreen';
// Screen
import StyledTabBar from 'navigation/components/StyledTabBar';
import navigationConfigs, { tabScreenOptions } from 'navigation/config/options';
import { TAB_NAVIGATION_ROOT } from 'navigation/config/routes';
import React from 'react';

const MainStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

const EatingStack = () => (
    <MainStack.Navigator screenOptions={navigationConfigs}>
        <MainStack.Screen name={TAB_NAVIGATION_ROOT.EATING_ROUTE.LIST} component={ListEatingScreen} />
    </MainStack.Navigator>
);
const PlayingStack = () => (
    <MainStack.Navigator screenOptions={navigationConfigs}>
        <MainStack.Screen name={TAB_NAVIGATION_ROOT.PLAYING_ROUTE.LIST} component={ListPlayingScreen} />
    </MainStack.Navigator>
);
const PlanningStack = () => (
    <MainStack.Navigator screenOptions={navigationConfigs}>
        <MainStack.Screen name={TAB_NAVIGATION_ROOT.PLANNING_ROUTE.LIST} component={ListPlanningScreen} />
    </MainStack.Navigator>
);
const SettingsStack = () => (
    <MainStack.Navigator screenOptions={navigationConfigs}>
        <MainStack.Screen name={TAB_NAVIGATION_ROOT.SETTING_ROUTE.SETTINGS} component={SettingScreen} />
    </MainStack.Navigator>
);

const MainTabContainer = () => {
    const ArrayTabs = [
        {
            name: TAB_NAVIGATION_ROOT.EATING_ROUTE.ROOT,
            title: 'Ăn uống',
            component: EatingStack,
            icon: 'food-bank',
        },
        {
            name: TAB_NAVIGATION_ROOT.PLAYING_ROUTE.ROOT,
            title: 'Vui chơi',
            component: PlayingStack,
            icon: 'tour',
        },
        {
            name: TAB_NAVIGATION_ROOT.PLANNING_ROUTE.ROOT,
            title: 'Kế hoạch',
            component: PlanningStack,
            icon: 'list-alt',
        },
        {
            name: TAB_NAVIGATION_ROOT.SETTING_ROUTE.ROOT,
            title: 'Cài đặt',
            component: SettingsStack,
            icon: 'settings',
        },
    ];
    return (
        <MainTab.Navigator
            screenOptions={tabScreenOptions}
            tabBar={(props: BottomTabBarProps) => <StyledTabBar {...props} />}
        >
            {ArrayTabs.map((item, index) => (
                <MainTab.Screen key={`${index}`} options={{ ...item }} {...item} />
            ))}
        </MainTab.Navigator>
    );
};

export default MainTabContainer;
