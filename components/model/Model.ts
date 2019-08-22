import { Card, Deck, ShuffableDeck } from "./Cards";

export class Encounter {
    constructor(readonly hero: Player, readonly enemy: Player) {}

    endTurn() {
        let encounter: Encounter = this;
        encounter = encounter.hero.effects.reduce((encounterUpdate, card) => card.endTurn(encounterUpdate), encounter);
    
        encounter = encounter.update({enemy: encounter.enemy.draw()}); 
        
        encounter = encounter.enemyPlaysCard(encounter.enemy.hand.draw());
        encounter = encounter.update({hero: encounter.hero.draw()}); 
        //give a card
        return encounter.hero.effects.reduce((encounterUpdate, card) => card.beginTurn(encounterUpdate), encounter);    
    }


    update({hero = this.hero, enemy = this.enemy}) {
        return new Encounter(hero, enemy);
    }

    enemyPlaysCard(card: Card) {
        if (!card) return this;
        let playing: Card = this.enemy.effects.reduce((finalCard: Card, effect: Card) => effect.cardPlayed(finalCard), card);
        let nextEncounter = playing.play(new Encounter(this.enemy, this.hero));
        nextEncounter = new Encounter(nextEncounter.enemy, nextEncounter.hero);
        return nextEncounter.update({enemy: nextEncounter.enemy.remove(card)});
    }


    heroPlaysCard(card: Card): Encounter {
        if (!card) return this;
        let playing: Card = this.hero.effects.reduce((finalCard: Card, effect: Card) => effect.cardPlayed(finalCard), card);
        let nextEncounter = playing.play(this);        
        return nextEncounter.update({hero: nextEncounter.hero.remove(card)});
    }
}

export class Player {
    constructor(readonly health: number, readonly deck: Deck, readonly hand: Deck = new ShuffableDeck(), readonly effects: Deck = new ShuffableDeck()) {
    }

    draw(): Player {
        let card: Card = this.deck.draw();
        return new Player(this.health, this.deck.remove(card), this.hand.with(card), this.effects);
    }

    remove(card: Card): Player {
        return new Player(this.health, this.deck, this.hand.remove(card), this.effects);
    }

    update({health = this.health}) {
        return new Player(health, this.deck, this.hand, this.effects);
    }
    // play = function(card: Card): Player {
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
    // }

    // endTurn = function(): Player {
    //     if (this.deck.length > 0) {
    //         return Object.assign({}, this, {hand: this.hand.concat(this.deck.pop())} );
    //     }

    //     return this;
    // }
}

