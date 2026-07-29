// same pattern as FeedStack, for the saved tab

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SavedScreen from '../screens/SavedScreen';
import ArticleScreen from '../screens/ArticleScreen';
import ArticleReaderScreen from '../screens/ArticleReaderScreen';
import CommentsScreen from '../screens/CommentsScreen';
import StoryHelpScreen from '../screens/StoryHelpScreen';

const Stack = createNativeStackNavigator();

export default function SavedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SavedHome" component={SavedScreen} />
      <Stack.Screen name="Article" component={ArticleScreen} />
      <Stack.Screen name="ArticleReader" component={ArticleReaderScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
      <Stack.Screen name="StoryHelp" component={StoryHelpScreen} />
    </Stack.Navigator>
  );
}