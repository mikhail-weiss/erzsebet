import { Card, CardType, Deck, HigherOrderCard, ShuffableDeck, BaseCard } from 'components/model/Cards';
import { Encounter } from 'components/model/Encounter';
import { damage, returnCard, addEffect, removeEffect } from 'components/model/Player';
import React, { FunctionComponent } from 'react';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
    title: { textAlign: 'center', marginBottom: 2, flex: 1 },
    image: { width: '100%', height: '100%' }
})

class Punch extends BaseCard {
    types = [CardType.Touch, CardType.Damage];
    constructor(readonly dmg: number) { super(); }

    play = (table: Encounter): Encounter => table.updateEnemy(damage(this.dmg)).updateHero(returnCard(this));

    // display: FunctionComponent<{}> = () => (<Image source={require('./images/MurderOfCrows.png')} style={styles.image}/> )
    display: FunctionComponent<{}> = () => <Text >Punch {this.dmg}</Text>

}

class Heal extends BaseCard {
    types = [CardType.Heal];
    constructor(readonly hp: number) { super(); }
    play = (table: Encounter): Encounter => table.updateHero(damage(-this.hp), returnCard(this));

    display: FunctionComponent<{}> = () => <Text >Heal {this.hp}</Text>
}

class AddDamage extends BaseCard {
    constructor(readonly adder: number) {
        super();
    }

    play = (table: Encounter): Encounter => table.updateHero(addEffect(this));
    endTurn = (table: Encounter): Encounter => table.updateHero(removeEffect(this));

    cardPlayed = (card: Card): Card => {
        if (card.is(CardType.Damage)) {
            return new HigherOrderCard(card, {
                play: (table: Encounter): Encounter => card.play(table).updateEnemy(damage(this.adder))
            });
        }

        return card;
    }
    display: FunctionComponent<{}> = () => <Text >Add Damage {this.adder}</Text>
}

class Poison extends BaseCard {
    constructor(readonly duration: number) { super(); }

    play = (table: Encounter): Encounter => {
        let effectDuration = this.duration;
        const effect = new HigherOrderCard(this, {
            endTurn: (table: Encounter): Encounter => table.updateEnemy(damage(1)),
            beginTurn: (table: Encounter): Encounter => effectDuration-- ? table : table.updateHero(removeEffect(effect)),
            display: () => <Text >Poison for {effectDuration} turns</Text>
        })
        return table.updateHero(addEffect(effect));
    }
    display: FunctionComponent<{}> = () => <Text >Poison for {this.duration} turns</Text>
}

class BlockDamage extends BaseCard {
    constructor(readonly block: number) {
        super();
    }

    play = (table: Encounter): Encounter => table.updateEnemy(addEffect(this));

    cardPlayed = (card: Card): Card => {
        if (card.is(CardType.Damage)) {
            return new HigherOrderCard(card, {
                play: (table: Encounter): Encounter => {
                    let encounter = card.play(table);

                    const initialDamage = Math.max(0, table.enemy.health - encounter.enemy.health);
                    const blockedDamage = Math.min(this.block, initialDamage);

                    return encounter.updateEnemy(damage(-blockedDamage)).updateHero(removeEffect(this));
                }
            });
        }
        return card;
    };

    display: FunctionComponent<{}> = () => <Text>Block {this.block}</Text>
}

class ReflectDamage extends BaseCard {
    readonly reflect: number;
    constructor(reflect: number) {
        super();
        this.reflect = (reflect / 8);
    }

    play = (table: Encounter): Encounter => table.updateEnemy(addEffect(this));

    cardPlayed = (card: Card): Card => {
        if (card.is(CardType.Damage)) {
            return new HigherOrderCard(card, {
                play: (table: Encounter): Encounter => {
                    let encounter = card.play(table);
                    let reflectDamage = Math.max(0, table.enemy.health - encounter.enemy.health);
                    reflectDamage = reflectDamage * this.reflect;

                    return encounter.updateHero(removeEffect(this)).updateHero(damage(reflectDamage));;
                }
            });
        }

        return card;
    }

    display: FunctionComponent<{}> = () => <Text >Reflect {this.reflect} of damage</Text>
}

class DoubleDamage extends BaseCard {
    constructor(readonly multiplier: number) {
        super();
    }
    play = (table: Encounter): Encounter => table.updateHero(addEffect(this));

    cardPlayed = (card: Card): Card => {
        if (card.is(CardType.Damage)) {
            return new HigherOrderCard(card, {
                play: (table: Encounter): Encounter => {
                    let encounter = card.play(table);
                    const actualDamage = (table.enemy.health - encounter.enemy.health) * (this.multiplier - 1);
                    return encounter.updateEnemy(damage(actualDamage)).updateHero(removeEffect(this));
                }
            });
        }
        return card;
    }
    display: FunctionComponent<{}> = () => <Text >Multiply next damage by {this.multiplier}</Text>
}

export const D = (): Deck => new ShuffableDeck([new ReflectDamage(4), new ReflectDamage(4), new ReflectDamage(4), new ReflectDamage(4), new ReflectDamage(4), new ReflectDamage(4)]);

export const XD = (): Deck => new ShuffableDeck([new BlockDamage(4), new Heal(4), new ReflectDamage(4), new Punch(4), new Punch(4), new Punch(4)]);
export const XB = (): Deck => new ShuffableDeck([new Poison(4)]);
export const XT = (): Deck => new ShuffableDeck([new AddDamage(4), new Punch(4), new Punch(4), new Heal(4), new Punch(4), new Punch(4)]);


export const nextEncounter = (length: number): Deck => new ShuffableDeck(Array.from(cardGenerator(3, length)));

export function* cardGenerator(power: number, count: number) {
    while (count--) {
        yield nextCard(power);
    }
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