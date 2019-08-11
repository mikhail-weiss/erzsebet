import React from 'react';
import { View, Button } from "react-native";
import { D, XB, XT } from "./builds";
import { Text, TextStyle, ViewStyle, StyleSheet } from 'react-native';


export default function Home({ navigation }) {
  return (
    <View style={style.container} >
      <View style={style.button}>
        <Button title="D" onPress={() => navigation.navigate('Battle', { cards: D })} />
      </View>
      <View style={style.button}>
        <Button title="XB" onPress={() => navigation.navigate('Battle', { cards: XB })} />
      </View>
      <View style={style.button}>
        <Button title="XT" onPress={() => navigation.navigate('Battle', { cards: XT })} />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  button: { margin: 2 },
  container: { justifyContent: 'center', flex: 1 }
})