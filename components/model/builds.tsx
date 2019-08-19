import { ShuffableDeck, Card, Deck, BaseCard, CardType } from './Cards';
import React, { ComponentType, FunctionComponent } from 'react';
import { View, Text, ViewStyle, StyleSheet } from 'react-native';

class Punch extends BaseCard {
    type = CardType.Touch;
    constructor(readonly dmg: number) {
        super();
    }

    display: FunctionComponent<{}> = () => (
        <>
            <Text style={{ textAlign: 'center', marginBottom: 2, flex: 1 }}>Sucker Punch!</Text>
            <Text>Makes a {this.dmg} damage</Text>
            <Text>Touch (duh!)</Text>
        </>
    )

}

export const D = (): Deck => new ShuffableDeck(new Punch(4), new Punch(4), new Punch(4), new Punch(4), new Punch(4), new Punch(4)).shuffle();
export const XB = (): Deck => new ShuffableDeck(new Punch(1), new Punch(1), new Punch(1), new Punch(3), new Punch(8)).shuffle()
export const XT = (): Deck => new ShuffableDeck(new Punch(1), new Punch(1), new Punch(2), new Punch(6), new Punch(6)).shuffle();


export const nextEncounter = (): Deck => {
    return [D, XB, XT][Math.floor((Math.random() * 3))]();
}
