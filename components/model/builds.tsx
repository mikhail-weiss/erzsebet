import React, { FunctionComponent } from 'react';
import { Text } from 'react-native';
import { BaseCard, CardType, Deck, ShuffableDeck } from './Cards';
import { Encounter } from './Model';

class Punch extends BaseCard {
    type = CardType.Touch;
    constructor(readonly dmg: number) {
        super();
    }
   
    play = (table: Encounter): Encounter => {
        return table.update({enemy: table.enemy.update({health: table.enemy.health - this.dmg})});
    }

    display: FunctionComponent<{}> = () => (
        <>
            <Text style={{ textAlign: 'center', marginBottom: 2, flex: 1 }}>Sucker Punch!</Text>
            <Text>Makes a {this.dmg} damage</Text>
            <Text>Touch (duh!)</Text>
        </>
    )

}

export const D = (): Deck => new ShuffableDeck([new Punch(4), new Punch(4), new Punch(4), new Punch(4), new Punch(4), new Punch(4)]).shuffle();
export const XB = (): Deck => new ShuffableDeck([new Punch(1), new Punch(1), new Punch(1), new Punch(3), new Punch(8)]).shuffle()
export const XT = (): Deck => new ShuffableDeck([new Punch(1), new Punch(1), new Punch(2), new Punch(6), new Punch(6)]).shuffle();


export const nextEncounter = (): Deck => {
    return [D, XB, XT][Math.floor((Math.random() * 3))]();
}
