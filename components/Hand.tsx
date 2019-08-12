import { StyleSheet, Text, View, TouchableHighlight, GestureResponderEvent, ScrollView } from 'react-native';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { Card } from './Card';


export default function ({onPlay, cards}) {
  let [availableCards, setAvailableCards]: [Card[], Dispatch<SetStateAction<Card[]>>] = useState(cards);
  const play = (card: Card) => {
    
    setAvailableCards(availableCards.filter((cardInHand: Card) => cardInHand !== card));
    onPlay(card)
  }

  return <ScrollView contentContainerStyle={styles.handContainer} horizontal={true} centerContent={true}>
    {availableCards.map((card: Card) => (
      <TouchableHighlight key={card.name} onPress={() => play(card)} underlayColor='blue'>
        <View style={styles.card}>
          <Text style={styles.title}>{card.name}</Text>
          <Text>{card.description}</Text>
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
    height: 120,
    width: 90
  },
  handContainer: {flexGrow: 1, justifyContent: 'center'}

});
