import { StyleSheet, Text, View, TouchableHighlight, GestureResponderEvent, ScrollView } from 'react-native';
import React from 'react';
import { Card } from './Card';


export default function ({cards}) {
  const _onPressButton = (event: GestureResponderEvent) => {
    alert(event)
  };

  return <ScrollView contentContainerStyle={styles.handContainer} horizontal={true} centerContent={true}>
    {cards.map((card: Card) => (
      <TouchableHighlight key={card.name} onPress={_onPressButton} underlayColor='blue'>
        <View style={styles.card}>
          <Text style={styles.title}>{card.name}</Text>
          <Text>dmg: {card.dmg}</Text>
        </View>
      </TouchableHighlight>
    ))}
  </ScrollView>
}

const styles = StyleSheet.create({

  title: {
    textAlign: 'center',
    marginBottom: 2,
    flex: 1
  },
  card: {
    margin: 5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 5,
    height: 100
  },
  handContainer: {flexGrow: 1, justifyContent: 'center'}

});
