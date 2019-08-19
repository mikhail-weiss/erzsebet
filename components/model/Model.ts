import { Card, Deck } from "./Cards";

export class Encounter {
    constructor(readonly hero: Player, readonly enemy: Player) {}
}

export class Player {
    hand: Card[] = [];
    
    constructor(readonly health: number, readonly deck: Deck) {
    }

    play = function(card: Card): Player {
        // this.powers.forEach(power => {
        //     power(card);
        // });
        // this.boosts.forEach(power => {
        //     power(card);
        // });
        
        // return Object.assign({}, this, {
        //     boosts: [],
        //     hand: this.hand.filter((cardInHand: Card) => cardInHand !== card)
        // });
    }

    endTurn = function(): Player {
        if (this.deck.length > 0) {
            return Object.assign({}, this, {hand: this.hand.concat(this.deck.pop())} );
        }

        return this;
    }
}

