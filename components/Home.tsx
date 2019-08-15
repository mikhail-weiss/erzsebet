import React from 'react';
import { View, Button } from "react-native";
import { D, XB, XT } from "./builds";
import { StyleSheet } from 'react-native';

const nextEncounter = () => {
  return [D, XB, XT][Math.floor((Math.random()*3))]();
  
}

export default function Home({ navigation }) {
  return (
    <View style={style.container} >
      <View style={style.button}>
        <Button title="D" onPress={() => navigation.navigate('Battle', { cards: D(), enemyCards: nextEncounter() })} />
      </View>
      <View style={style.button}>
        <Button title="XB" onPress={() => navigation.navigate('Battle', { cards: XB(), enemyCards: nextEncounter() })} />
      </View>
      <View style={style.button}>
        <Button title="XT" onPress={() => navigation.navigate('Battle', { cards: XT(), enemyCards: nextEncounter() })} />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  button: { margin: 2 },
  container: { justifyContent: 'center', flex: 1 }
})