import { FunctionComponent } from "react";
import { Encounter } from "./Model";

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
    Touch
}

interface Shuffable {
    shuffle(): Deck;
    remove(cardToRemove: Card): Deck;
    with(card: Card): Deck;
    reduce<U>(callbackfn: (previousValue: U, currentValue: Card, currentIndex: number, array: ReadonlyArray<Card>) => U, initialValue: U): U;
    map<U>(callbackfn: (value: Card) => U): U[];
    draw(): Card;
}
export type Deck = Shuffable;

export class ShuffableDeck implements Shuffable {
    items: readonly Card[];    
    constructor(items?: readonly Card[]) {
        this.items = items ? items.slice(): [];
    }
    
    draw(): Card {        
        return this.items[0];
    }
    
    map<U>(callbackfn: (value: Card) => U): U[] {
        return this.items.map(callbackfn);
    }

    reduce<U>(callbackfn: (previousValue: U, currentValue: Card, currentIndex: number, array: ReadonlyArray<Card>) => U, initialValue: U): U {
        return this.items.reduce(callbackfn, initialValue);
    }

    remove(cardToRemove: Card): Deck {
        return new ShuffableDeck(this.items.filter((card: Card) => cardToRemove.id !== card.id));
    }

    with(cardToAdd: Card): Deck {
        return new ShuffableDeck(this.items.concat(cardToAdd));
    }

    shuffle(): Deck {
        let length = this.items.length;
        let copy = this.items.slice();
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
    readonly type: CardType;

    cardPlayed(card: Card): Card;
    display: FunctionComponent<{}>;
    play(table: Encounter): Encounter;
    beginTurn(table: Encounter): Encounter;
    endTurn(table: Encounter): Encounter;
}

export abstract class BaseCard implements Card {
    id: number;
    type: CardType = CardType.Default;

    constructor() {
        this.id = globalId++;         
    }

    cardPlayed = (card: Card): Card => card;
    endTurn = (table: Encounter): Encounter => table;
    beginTurn = (table: Encounter): Encounter => table;
    play = (table: Encounter): Encounter => table;
    
    abstract display: FunctionComponent<{}>;
}