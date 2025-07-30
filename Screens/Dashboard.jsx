
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Main from './Main.jsx';
import Second from './Second.jsx';

const Tab = createBottomTabNavigator();

export default function Dashboard() {
  return (
    <Tab.Navigator  initialRouteName="Second">
      <Tab.Screen name="Main" component={Main} options={{ headerShown: false }}/>
      <Tab.Screen name="Second" component={Second} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}
