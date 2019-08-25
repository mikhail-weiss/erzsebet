import React, { FunctionComponent } from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { BaseCard, CardType, Deck, ShuffableDeck, Card } from '../model/Cards';
import { Encounter } from '../model/Model';

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
        <Image source={require('./images/MurderOfCrows.png')} style={{width: '100%', height: '100%'}}/>        
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
        <Image source={require('./images/SwampMosquitoes.png')} style={{width: '100%', height: '100%'}}/>        
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
        <Image source={require('./images/ABeastInside.png')} style={{width: '100%', height: '100%'}}/>        
    )
}

export const D = (): Deck => new ShuffableDeck([new Punch(4), new Punch(4), new Punch(4), new Punch(4), new Punch(4), new Punch(4)]).shuffle();
export const XB = (): Deck => new ShuffableDeck([new DoubleDamage(), new Punch(1), new Punch(1), new Punch(1), new Punch(3), new Punch(8)]).shuffle();
export const XT = (): Deck => new ShuffableDeck([new AddDamage(), new Punch(1), new Punch(1), new Punch(2), new Punch(6), new Punch(6)]).shuffle();


export const nextEncounter = (): Deck => {
    return [D, XB, XT][Math.floor((Math.random() * 3))]();
}
