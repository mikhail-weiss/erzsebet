type Effect = (hero: Player, enemy: Player) => [Player, Player];
type Power = (card: Card) => Card;

export class Card {
    name: string;
    description: string;
    effect: Effect;
    damage: number;
}

export class Player {
    powers: Power[] = [];
    boosts: Power[] = [];
    hand: Card[] = [];
    
    constructor(public health: number, public deck: Card[]) {}

    play = function(card: Card): Player {
        this.powers.forEach(power => {
            power(card);
        });
        this.boosts.forEach(power => {
            power(card);
        });
        
        return Object.assign({}, this, {
            boosts: [],
            hand: this.hand.filter((cardInHand: Card) => cardInHand !== card)
        });
    }

    endTurn = function(): Player {
        if (this.deck.length > 0) {
            return Object.assign({}, this, {hand: this.hand.concat(this.deck.pop())} );
        }

        return this;
    }
}

