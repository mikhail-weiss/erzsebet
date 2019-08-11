import React from 'react';
import { StyleSheet } from 'react-native';
import {createSwitchNavigator, createAppContainer } from 'react-navigation';
import Battle from './components/Battle';
import Home from './components/Home';

const MainNavigator =  createSwitchNavigator({
  Home: {screen: Home},
  Battle: {screen: Battle},
});

const App = createAppContainer(MainNavigator);
export default App;
