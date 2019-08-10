import React from 'react';
import { StyleSheet, Text, View, TextStyle, ViewStyle } from 'react-native';
import Hand from './components/Hand';
import Table from './components/Table';

let cards = [{
  name: 'jaeger',
  health: 100,
  attack: 10
},
{
  name: 'claws',
  attack: 10
},
{
  name: 'charm',
  attack: 10
}];

export default function App() {
  return (
    <View style={style.container}>
      <View style={style.table}>
        <Table >Lena</Table>
      </View>
      <View style={style.hand}>
        <Hand cards={cards}></Hand>
      </View>
    </View>
  );
}


const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  table: {
    flex: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hand: {
    flex: 2,
    justifyContent: 'center',
}})