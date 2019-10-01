import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, TouchableHighlight } from "react-native";
import { nextEncounter, nextCard } from './cards/builds';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';
import { Card, Deck, ShuffableDeck } from './model/Cards';
import { number } from 'prop-types';
import { NavigationScreenProp } from 'react-navigation';

interface WinScreenProps {
    navigation: NavigationScreenProp<any, any>;
    deck: Deck;
    count: number;
}

export const Win = withMappedNavigationParams()(({ navigation, deck, count }: WinScreenProps) => {
    const chooseNewCard = [nextCard(4), nextCard(4), nextCard(4)];
    count = count - 1;

    const onChoose = (card: Card) => {
        navigation.navigate('Battle', { deck: new ShuffableDeck(deck.cards.concat(card)).shuffle(), enemyCards: nextEncounter(deck.length+1), count })        
    }
    return (
        <View style={styles.choose}>
            {chooseNewCard.map((card: Card) => (
                <TouchableHighlight key={card.id} onPress={() => onChoose(card)} underlayColor='blue'>
                    <View style={styles.card}>
                        {card.display({})}
                    </View>
                </TouchableHighlight>
            ))}
            <Button title='restart' onPress={() => navigation.navigate('Home')} />
        </View>
    )
})

export const Lost = ({ navigation }) => (
    <View style={styles.screen}>
        <Text style={styles.message}>you died</Text>
        <Button title='continue' onPress={() => navigation.navigate('Home')} />
    </View>
)

const styles = StyleSheet.create({
    message: { fontSize: 20, textAlign: 'center', lineHeight: 40 },
    screen: { flex: 1, justifyContent: 'center' },
    card: {
        margin: 5,
        height: 400,
        width: 300,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    choose: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});