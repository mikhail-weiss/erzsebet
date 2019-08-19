import { ComponentType, FunctionComponent } from "react";
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
}
export type Deck = ReadonlyArray<Card> & Shuffable;
   
export class ShuffableDeck extends Array<Card> implements Shuffable {
    constructor(...items: any) {
        super(...items);
        Object.setPrototypeOf(this, ShuffableDeck.prototype);
    }
    static create<T>(): ShuffableDeck {
        return Object.create(ShuffableDeck.prototype);
    }
    
    shuffle(): Deck {
        let length = this.length;
        let copy = this.slice();
        const shuffled: Card[] = [];
    
        for (let i = 0; i < length; i++) {
            let j = Math.floor(Math.random() * (copy.length));
    
            shuffled.push(...copy.splice(j, 1));
        }
        return new ShuffableDeck(...shuffled);
    }
}


let globalId = 0;
export interface Card {
    readonly id: number;
    readonly type: CardType;
    readonly damage: number;

    cardPlayed(card: Card): Card;
    display: FunctionComponent<{}>;
    play(table: Encounter): Encounter;
    beginTurn(table: Encounter): Encounter;
    endTurn(table: Encounter): Encounter;
}

export abstract class BaseCard implements Card {
    id: number;
    type: CardType = CardType.Default;
    damage: number;

    constructor() {
        this.id = globalId++;         
    }

    cardPlayed = (card: Card): Card => card;
    endTurn = (table: Encounter): Encounter => table;
    beginTurn = (table: Encounter): Encounter => table;
    play = (table: Encounter): Encounter => table;
    
    abstract display: FunctionComponent<{}>;

    // abstract display: ComponentType<{}>;
}