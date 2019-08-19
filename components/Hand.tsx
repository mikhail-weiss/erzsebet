import { StyleSheet, Text, View, TouchableHighlight, GestureResponderEvent, ScrollView } from 'react-native';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { Card } from './model/Cards';

export default function ({ onPlay, cards }) {
  return <ScrollView contentContainerStyle={styles.handContainer} horizontal={true} centerContent={true}>
    {cards.map((card: Card) => (
        <TouchableHighlight key={card.id} onPress={() => onPlay(card)} underlayColor='blue'>
          <View style={styles.card}>
            {card.display({})}
          </View>
        </TouchableHighlight>
      )
    )}
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
  handContainer: { flexGrow: 1, justifyContent: 'center' }

});
