import React, { FunctionComponent } from 'react';
import { Text, StyleSheet } from 'react-native';
import { BaseCard, CardType, Deck, ShuffableDeck, Card } from './Cards';
import { Encounter } from './Model';

const styles = StyleSheet.create({
    title: { textAlign: 'center', marginBottom: 2, flex: 1 }
})
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
            <Text style={styles.title}>Sucker Punch!</Text>
            <Text>Makes a {this.dmg} damage</Text>
            <Text>Touch (duh!)</Text>
        </>
    )
}


class AddDamage extends BaseCard {
    type = CardType.Touch;
    constructor() {
        super();
    }

    endTurn = (table: Encounter): Encounter => {
        return table.update({hero: table.hero.withoutEffect(this)});
    };
   
    play = (table: Encounter): Encounter => {
        return table.update({hero: table.hero.withEffect(this)});
    }

    cardPlayed = (card: Card): Card => {
        if(card instanceof Punch) {
            let newCard = new Punch(card.dmg + 2);
            return newCard;
        }
        return card;
    }

    display: FunctionComponent<{}> = () => (
        <>
            <Text style={styles.title}>Doulbe damage!</Text>
            <Text>Adds +2 to all damage this turn</Text>
        </>
    )
}

class DoubleDamage extends BaseCard {
    type = CardType.Touch;
    constructor() {
        super();
    }
   
    play = (table: Encounter): Encounter => {
        return table.update({hero: table.hero.withEffect(this)});
    }

    cardPlayed = (card: Card): Card => {
        if(card instanceof Punch) {
            let newCard = new Punch(card.dmg);
            newCard.play = (table: Encounter): Encounter => {
                let encounter = card.play(card.play(table));

                return encounter.update({hero: encounter.hero.withoutEffect(this)});
            }

            return newCard;
        }
        return card;
    }

    display: FunctionComponent<{}> = () => (
        <>
            <Text style={styles.title}>Doulbe damage!</Text>
            <Text>Doubles next damage</Text>
        </>
    )
}

export const D = (): Deck => new ShuffableDeck([new Punch(4), new Punch(4), new Punch(4), new Punch(4), new Punch(4), new Punch(4)]).shuffle();
export const XB = (): Deck => new ShuffableDeck([new DoubleDamage(), new Punch(1), new Punch(1), new Punch(1), new Punch(3), new Punch(8)]).shuffle();
export const XT = (): Deck => new ShuffableDeck([new AddDamage(), new Punch(1), new Punch(1), new Punch(2), new Punch(6), new Punch(6)]).shuffle();


export const nextEncounter = (): Deck => {
    return [D, XB, XT][Math.floor((Math.random() * 3))]();
}
