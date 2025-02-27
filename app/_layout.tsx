import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "./src/components/CustomIcon/CustomIcon";
import FeedScreen from "./src/screens/FeedScreen";
import BatteryScreen from "./src/screens/BatteryScreen";
import SettingScreen from "./src/screens/SettingScreen";
import type { RootTabParamList } from "@/app/src/types/types";
import { Platform } from "react-native";
import { store } from "../store/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { useTheme } from "react-native-paper";

const ICON_SIZE = Platform.OS === "android" ? 20 : 24;
const TAB_HEIGHT = 72;

type TabIconConfig = {
  [key in keyof RootTabParamList]: { default: string; focused: string };
};

const tabIcons: TabIconConfig = {
  Feed: { default: "home", focused: "home-work" },
  Battery: { default: "battery-saver", focused: "battery-alert" },
  Setting: { default: "settings", focused: "settings" },
};

const getTabIcon = (routeName: keyof RootTabParamList, focused: boolean) => {
  return focused ? tabIcons[routeName].focused : tabIcons[routeName].default;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// MainTabs is placed inside ThemeProvider so that useTheme accesses the current theme
function MainTabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => (
          <Icon
            name={getTabIcon(route.name, focused)}
            size={ICON_SIZE}
            color={color}
          />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarStyle: {
          height: TAB_HEIGHT,
          backgroundColor: theme.colors.background,
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Battery" component={BatteryScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <MainTabs />
      </ThemeProvider>
    </Provider>
  );
}
