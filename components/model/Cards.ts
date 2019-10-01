import { FunctionComponent } from "react";
import { Encounter } from "./Encounter";

// 5 dmg
// 10 dmg at the beginning of the next turn
// no damage for 1 turn
// -1 hp at the begining of your turn, 5 turns
// +6 hp over 3 turns
// no healing, 2 turns both
// return 50% of damage attack as health
// 2x damage for 1 turn
// no touch 1 turn, invisible
// transfer damage to familiar
// 10hp minion with 2hp counter

export enum CardType {
    Default,
    Touch,
    Damage
}

interface Shuffable {
    cards: readonly Card[];    
    length: number;
    shuffle(): Deck;
    without(cardToRemove: Card): Deck;
    with(card: Card): Deck;
    reduce<U>(callbackfn: (previousValue: U, currentValue: Card, currentIndex: number, array: ReadonlyArray<Card>) => U, initialValue: U): U;
    map<U>(callbackfn: (value: Card) => U): U[];
    draw(index?: number): Card;
}
export type Deck = Shuffable;

export class ShuffableDeck implements Shuffable {
    cards: readonly Card[];    
    public length: number;
    constructor(items?: readonly Card[]) {
        this.cards = items ? items.slice(): [];        
        this.length = this.cards.length;
    }
    
    draw(index = 0): Card {        
        return this.cards[index];
    }
    
    map<U>(callbackfn: (value: Card) => U): U[] {
        return this.cards.map(callbackfn);
    }

    reduce<U>(callbackfn: (previousValue: U, currentValue: Card, currentIndex: number, array: ReadonlyArray<Card>) => U, initialValue: U): U {
        return this.cards.reduce(callbackfn, initialValue);
    }

    without(cardToRemove: Card): Deck {
        return new ShuffableDeck(this.cards.filter((card: Card) => cardToRemove.id !== card.id));
    }

    with(cardToAdd: Card): Deck {
        return new ShuffableDeck(this.cards.concat(cardToAdd));
    }

    shuffle(): Deck {
        let length = this.cards.length;
        let copy = this.cards.slice();
        const shuffled: Card[] = [];
    
        for (let i = 0; i < length; i++) {
            let j = Math.floor(Math.random() * (copy.length));
    
            shuffled.push(...copy.splice(j, 1));
        }
        return new ShuffableDeck(shuffled);
    }
}


let globalId = 0;
export interface Card {
    readonly id: number;
    readonly type: CardType[];

    cardPlayed(card: Card): Card;
    display: FunctionComponent<{}>;
    play(table: Encounter): Encounter;
    beginTurn(table: Encounter): Encounter;
    endTurn(table: Encounter): Encounter;
}

export class BaseCard implements Card {
    id: number;
    type: CardType[] = [];

    constructor() {
        this.id = globalId++;         
    }

    cardPlayed = (card: Card): Card => card;
    endTurn = (table: Encounter): Encounter => table;
    beginTurn = (table: Encounter): Encounter => table;
    play = (table: Encounter): Encounter => table;
    
    display: FunctionComponent<{}>;
}

export class HigherOrderCard extends BaseCard {
    constructor(readonly card: Card, props = {}) {
        super();

        return Object.assign(this, props);
    }
    cardPlayed = this.card.cardPlayed.bind(this.card);
    endTurn = this.card.endTurn.bind(this.card);
    beginTurn = this.card.beginTurn.bind(this.card);
    play = this.card.play.bind(this.card);    
    display =  this.card.display.bind(this.card);
}