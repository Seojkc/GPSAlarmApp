import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './Screens/Main.jsx';
import Dashboard from './Screens/Dashboard.jsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import PushNotification from "react-native-push-notification";
import LandingScreen from './Screens/LandingPage.jsx';

PushNotification.createChannel(
  {
    channelId: 'gps-channel', // must match the one in notify function
    channelName: 'GPS Alerts',
    importance: 4, // high importance
    vibrate: true,
  },
  (created) => console.log(`Channel created: ${created}`)
);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={Dashboard}  options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
