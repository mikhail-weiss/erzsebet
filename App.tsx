import React from 'react';
import {createSwitchNavigator, createAppContainer } from 'react-navigation';
import Battle from 'components/Battle';
import Home from 'components/Home';
import {Win, Lost} from 'components/End';

const MainNavigator =  createSwitchNavigator({
  Home: {screen: Home},
  Battle: {screen: Battle},
  Win: {screen: Win},
  Lost: {screen: Lost},

});

const App = createAppContainer(MainNavigator);
export default App;
