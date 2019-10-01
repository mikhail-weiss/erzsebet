import React from 'react';
import { View, Button, ImageBackground } from "react-native";
import { D, XB, XT, nextEncounter, XD } from "../cards/builds";
import { StyleSheet } from 'react-native';

export default function Home({ navigation }) {
  return (
    <ImageBackground source={require('./street.jpg')} style={{ width: '100%', height: '100%' }}>

      <View style={style.container} >
        <View style={style.button}>
          <Button title="XD" onPress={() => navigation.navigate('Battle', { deck: XD(), enemyCards: nextEncounter(6) })} />
        </View>
        <View style={style.button}>
          <Button title="XB" onPress={() => navigation.navigate('Battle', { deck: XB(), enemyCards: nextEncounter(6) })} />
        </View>
        <View style={style.button}>
          <Button title="XT" onPress={() => navigation.navigate('Battle', { deck: XT(), enemyCards: nextEncounter(6) })} />
        </View>
      </View>
    </ImageBackground>
  );
}

const style = StyleSheet.create({
  button: { margin: 2 },
  container: { justifyContent: 'center', flex: 1 }
})