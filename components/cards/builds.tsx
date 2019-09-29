import React, { FunctionComponent } from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { BaseCard, CardType, Deck, ShuffableDeck, Card, HigherOrderCard } from 'components/model/Cards';
import { Encounter, Action, damage, withEffect, withoutEffect } from 'components/model/Model';

const styles = StyleSheet.create({
    title: { textAlign: 'center', marginBottom: 2, flex: 1 },
    image: {width: '100%', height: '100%'}
})

class Punch extends BaseCard {
    type = [CardType.Touch, CardType.Damage];
    constructor(readonly dmg: number) {super();}
   
    play = (table: Encounter): Encounter => table.updateEnemy(damage(this.dmg));

    // display: FunctionComponent<{}> = () => (<Image source={require('./images/MurderOfCrows.png')} style={styles.image}/> )
    display: FunctionComponent<{}> = () => <Text >Punch {this.dmg}</Text>

}

class Heal extends BaseCard {
    type = [CardType.Touch, CardType.Damage];
    constructor(readonly hp: number) {super();}
    play = (table: Encounter): Encounter => table.updateHero(damage(-this.hp));

    display: FunctionComponent<{}> = () => <Text >Heal {this.hp}</Text>

}


class AddDamage extends BaseCard {  
    constructor(readonly adder: number) {
        super();
    }

    play = (table: Encounter): Encounter => table.updateHero(withEffect(this));

    cardPlayed = (card: Card): Card => {
        if(card.type.includes(CardType.Damage)) {
            return new HigherOrderCard(card, {
                play: (table: Encounter): Encounter => card.play(table).updateEnemy(damage(this.adder))
            });
        } 
        
        return card;
    }
    display: FunctionComponent<{}> = () => <Text >Add Damage {this.adder}</Text>
}

class Poison extends BaseCard {  
    constructor(private duration: number) {super();}

    play = (table: Encounter): Encounter => table.updateEnemy(withEffect(this));
    endTurn = (table: Encounter): Encounter => table.updateEnemy(damage(1));
    beginTurn = (table: Encounter): Encounter => this.duration-- ? table: table.updateEnemy(withoutEffect(this));
    display: FunctionComponent<{}> = () => <Text >Poison for {this.duration} turns</Text>
}

class BlockDamage extends BaseCard {  
    constructor(readonly block: number) {
        super();
    }

    play = (table: Encounter): Encounter => table.updateEnemy(withEffect(this));

    cardPlayed = (card: Card): Card => {
        if(card.type.includes(CardType.Damage)) {
            return new HigherOrderCard(card, {
                play: (table: Encounter): Encounter => {
                    let encounter = card.play(table);

                    let realDamage = table.enemy.health - encounter.enemy.health;
                    realDamage = Math.max(0, realDamage - this.block);
                    
                    return table.updateEnemy(damage(realDamage)).updateHero(withoutEffect(this));
                }
            });
        } 
        
        return card;
    }

    display: FunctionComponent<{}> = () => <Text >Block {this.block}</Text>
}

class ReflectDamage extends BaseCard {  
    constructor(readonly reflect: number) {
        super();
    }

    play = (table: Encounter): Encounter => table.updateEnemy(withEffect(this));

    cardPlayed = (card: Card): Card => {
        if(card.type.includes(CardType.Damage)) {
            return new HigherOrderCard(card, {
                play: (table: Encounter): Encounter => {
                    let encounter = card.play(table);
                    let reflectDamage = table.enemy.health - encounter.enemy.health;
                    reflectDamage = Math.min(this.reflect, reflectDamage);
                    
                    return encounter.updateHero(withoutEffect(this)).updateHero(damage(reflectDamage));;
                }
            });
        } 
        
        return card;
    }

    display: FunctionComponent<{}> = () => <Text >Reflect {this.reflect}</Text>

}


class DoubleDamage extends BaseCard {
    constructor(readonly multiplier: number) {
        super();
    }
    play = (table: Encounter): Encounter => table.update({hero: table.hero.apply(withEffect(this))});

    cardPlayed = (card: Card): Card => {
        if(card.type.includes(CardType.Damage)) {
            
            return new HigherOrderCard(card, {
                play: (table: Encounter): Encounter => {
                    let encounter = card.play(table);
                    const actualDamage = (table.enemy.health - encounter.enemy.health)*(this.multiplier);
                    return table.updateEnemy(damage(actualDamage)).updateHero(withoutEffect(this));
                }
            });
        }
        return card;
    }
    display: FunctionComponent<{}> = () => <Text >Multiply damage by {this.multiplier}</Text>
}

export const D = (): Deck => new ShuffableDeck([new Punch(4), new Punch(4), new Punch(4), new Punch(4), new Punch(4), new Punch(4)]);

export const XD = (): Deck => new ShuffableDeck([new BlockDamage(4), new Heal(4), new ReflectDamage(4), new Punch(4), new Punch(4), new Punch(4)]);
export const XB = (): Deck => new ShuffableDeck([new DoubleDamage(4), new Punch(4), new Heal(4), new Punch(4), new Punch(4), new Punch(4)]);
export const XT = (): Deck => new ShuffableDeck([new AddDamage(4), new Punch(4), new Punch(4), new Heal(4), new Punch(4), new Punch(4)]);


export const nextEncounter = (): Deck => {
    return [D, XB, XT][Math.floor((Math.random() * 3))]();
}

const CARDS = [
    AddDamage,
    DoubleDamage,
    Punch,
    Heal,
    BlockDamage,
    ReflectDamage,
    Poison
];

export function nextCard(power: number): Card {
    const cardCreator = CARDS[Math.floor((Math.random() * CARDS.length))];
    return new cardCreator(power);
}