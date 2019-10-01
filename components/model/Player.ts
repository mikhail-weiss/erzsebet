import { Card, Deck, ShuffableDeck } from "./Cards";



export interface Action {
    (props: PlayerProps): PlayerProps
}

interface PlayerProps {
    health?: number; 
    deck?: Deck;
    hand?: Deck; 
    effects?: Deck;
}

export class Player implements PlayerProps {
    constructor(readonly health: number, readonly deck: Deck, readonly hand: Deck = new ShuffableDeck(), readonly effects: Deck = new ShuffableDeck()) {
    }

    draw(): Player {
        let card: Card = this.deck.draw();
        if(card) {
            return new Player(this.health, this.deck.without(card), this.hand.with(card), this.effects);
        } else {
            return this;
        }
    }
    
    apply(cb: (props: PlayerProps) => PlayerProps): Player {
        return this.update(cb(this))        
    }

    update({health = this.health, deck = this.deck, hand = this.hand, effects = this.effects}: PlayerProps) {
        return new Player(health, deck, hand, effects);
    }
}

export const damage = (dmg: number): Action => ({health}) => ({health: health - Math.floor(dmg)});
export const withoutEffect = (card: Card): Action => ({effects}) => ({effects: effects.without(card)});
export const withEffect = (card: Card): Action => ({effects}) => ({effects: effects.with(card)});
export const played = (card: Card): Action => ({hand}) => ({hand: hand.without(card)});
export const returnCard = (card: Card): Action => ({deck}) => ({deck: deck.with(card)});
export const addEffect = (card: Card): Action => (props) => Object.assign(withEffect(card)(props), played(card)(props));
export const removeEffect = (card: Card): Action => (props) => Object.assign(withoutEffect(card)(props), returnCard(card)(props));
