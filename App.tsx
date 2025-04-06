import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { RootStackParamList } from './types/types.ts';

import LoginScreen from './components/LoginScreen';
import ShuttleListScreen from './components/ShuttleListScreen';
import AddShuttleScreen from './components/AddShuttleScreen';
import FilterScreen from './components/FilterScreen';
import ShuttleDetailScreen from './components/ShuttleDetailScreen';
import MapScreen from './components/MapScreen';
import { StyleSheet, Dimensions } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ShuttleList" component={ShuttleListScreen} options={{ title: 'Shuttles' }} />
        <Stack.Screen name="AddShuttle" component={AddShuttleScreen} options={{ title: 'Add Shuttle' }} />
        <Stack.Screen name="Filter" component={FilterScreen} options={{ title: 'Filters' }} />
        <Stack.Screen name="ShuttleDetail" component={ShuttleDetailScreen} options={{ title: 'Shuttle Details' }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Map View' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // You can include all shared styles here from your previous styles.
  // For brevity, styles for each screen can also be scoped within the component file.
});
