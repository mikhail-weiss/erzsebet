import { StyleSheet, Text, View, TouchableHighlight, GestureResponderEvent, ScrollView, Modal, Alert } from 'react-native';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { Card, Deck } from '../model/Cards';

export default function ({ onPlay = () => {}, cards }: { onPlay?: (card: Card) => void, cards: Deck }) {

  const [modalVisible, setModalVisible] = useState(false);
  return <ScrollView contentContainerStyle={styles.handContainer} horizontal={true} centerContent={true}>
    {cards.map((card: Card) => (
      <TouchableHighlight key={card.id} onPress={() => onPlay(card) } underlayColor='blue' onPressIn={() => setModalVisible(true)} onPressOut={() => setModalVisible(false)}  >
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
    height: 120,
    width: 90,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  },
  handContainer: { flexGrow: 1, justifyContent: 'center',     alignItems: 'center', flex: 1}

});
