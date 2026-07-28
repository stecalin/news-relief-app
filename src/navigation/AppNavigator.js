// sets up the bottom tab bar and which screen each tab shows
// this is the top-level navigation structure for the whole app

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FeedStack from './FeedStack';
import HelpScreen from '../screens/HelpScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, fonts } from '../theme';

const Tab = createBottomTabNavigator();

// maps each tab's route name to the ionicon it should show
const TAB_ICONS = {
  Feed: 'newspaper-outline',
  Help: 'heart-outline',
  Profile: 'person-outline',
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 64,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontFamily: fonts.medium,
            fontSize: 11,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={TAB_ICONS[route.name]} color={color} size={size} />
          ),
        })}
      >
        <Tab.Screen name="Feed" component={FeedStack} />
        <Tab.Screen name="Help" component={HelpScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}