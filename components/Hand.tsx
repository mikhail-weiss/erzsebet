import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import React from 'react';


export default function ({cards}) {
  const _onPressButton = () => {
    alert('You tapped the button!')
  };
  return <View style={{flexDirection: 'row'}}>
    {cards.map(card => (
      <TouchableHighlight key={card.name} onPress={_onPressButton} underlayColor='blue'>
        <View style={styles.card}>
          <Text style={styles.title}>{card.name}</Text>
          <Text>hp: {card.health}</Text>
          <Text>dmg: {card.attack}</Text>
        </View>
      </TouchableHighlight>
    ))}
  </View>
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

  }
});
