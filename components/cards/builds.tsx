import React, { FunctionComponent } from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { BaseCard, CardType, Deck, ShuffableDeck, Card, HigherOrderCard } from 'components/model/Cards';
import { Encounter } from 'components/model/Model';

const styles = StyleSheet.create({
    title: { textAlign: 'center', marginBottom: 2, flex: 1 },
    image: {width: '100%', height: '100%'}
})

class Punch extends BaseCard {
    type = [CardType.Touch, CardType.Damage];
    constructor(readonly dmg: number) {super();}
   
    play = (table: Encounter): Encounter => table.update({enemy: table.enemy.update({health: table.enemy.health - this.dmg})});

    display: FunctionComponent<{}> = () => (<Image source={require('./images/MurderOfCrows.png')} style={styles.image}/> )
}

class AddDamage extends BaseCard {  
    constructor(readonly adder: number) {
        super();
    }

    play = (table: Encounter): Encounter => table.update({hero: table.hero.withEffect(this)});

    cardPlayed = (card: Card): Card => {
        if(card.type.includes(CardType.Damage)) {
            return new HigherOrderCard(card, {
                play: (table: Encounter): Encounter => {
                    let encounter = card.play(table);
                    return encounter.update({enemy: table.enemy.update({health: encounter.enemy.health - this.adder})});
                }
            });
        } 
        
        return card;
    }

    display: FunctionComponent<{}> = () => <Image source={require('./images/SwampMosquitoes.png')} style={styles.image}/>        
}

class DoubleDamage extends BaseCard {
    constructor(readonly multiplier: number) {
        super();
    }
    play = (table: Encounter): Encounter => table.update({hero: table.hero.withEffect(this)});

    cardPlayed = (card: Card): Card => {
        if(card.type.includes(CardType.Damage)) {
            
            return new HigherOrderCard(card, {
                play: (table: Encounter): Encounter => {
                    let encounter = card.play(table);

                    const damage = table.enemy.health - encounter.enemy.health 
                    encounter = encounter.update({enemy: encounter.enemy.update({health: encounter.enemy.health - damage*(this.multiplier-1)})});
                    return encounter.update({hero: encounter.hero.withoutEffect(this)});
                }
            });
        }
        return card;
    }

    display: FunctionComponent<{}> = () => (<Image source={require('./images/ABeastInside.png')} style={styles.image}/>);
}

export const D = (): Deck => new ShuffableDeck([new Punch(4), new Punch(4), new Punch(4), new Punch(4), new Punch(4), new Punch(4)]);
export const XB = (): Deck => new ShuffableDeck([new DoubleDamage(3), new Punch(1), new Punch(1), new Punch(1), new Punch(3), new Punch(8)]);
export const XT = (): Deck => new ShuffableDeck([new AddDamage(3), new Punch(1), new Punch(1), new Punch(2), new Punch(6), new Punch(6)]);

export const nextEncounter = (): Deck => {
    return [D, XB, XT][Math.floor((Math.random() * 3))]();
}


const CARDS = [
    AddDamage,
    DoubleDamage,
    Punch
];

export function nextCard(power: number): Card {
    const cardCreator = CARDS[Math.floor((Math.random() * 3))];
    return new cardCreator(power);
}