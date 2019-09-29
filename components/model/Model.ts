import { Card, Deck, ShuffableDeck } from "./Cards";

export class Encounter {
    constructor(readonly hero: Player, readonly enemy: Player) {
        
    }

    endTurn() {
        let encounter: Encounter = this;
        encounter = encounter.hero.effects.reduce((encounterUpdate, card) => card.endTurn(encounterUpdate), encounter);
        encounter = encounter.update({enemy: encounter.enemy.draw()}); 

        encounter = encounter.enemyTurn();
        
        encounter = encounter.update({hero: encounter.hero.draw()}); 
        return encounter.hero.effects.reduce((encounterUpdate, card) => card.beginTurn(encounterUpdate), encounter);    
    }


    update({hero = this.hero, enemy = this.enemy}) {
        return new Encounter(hero, enemy);
    }

    enemyTurn() {
        let enemyView = new Encounter(this.enemy, this.hero);
        enemyView = enemyView.hero.effects.reduce((encounterUpdate, card) => card.beginTurn(encounterUpdate), enemyView);

        if (this.enemy.hand.length > 0) {
            let card: Card = this.enemy.hand.draw()
            let playing: Card = this.enemy.effects.reduce((finalCard: Card, effect: Card) => effect.cardPlayed(finalCard), card);
            enemyView = playing.play(enemyView);
            enemyView = enemyView.update({hero: enemyView.hero.played(card)})
        }

        enemyView = enemyView.hero.effects.reduce((encounterUpdate, card) => card.endTurn(encounterUpdate), enemyView);    
        return new Encounter(enemyView.enemy, enemyView.hero);
    }


    heroPlaysCard(card: Card): Encounter {
        if (!card) return this;
        let playing: Card = this.hero.effects.reduce((finalCard: Card, effect: Card) => effect.cardPlayed(finalCard), card);
        let nextEncounter = playing.play(this);        
        return nextEncounter.update({hero: nextEncounter.hero.played(card)});
    }
}

export class Player {
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

    played(card: Card): Player {
        return new Player(this.health, new ShuffableDeck(this.deck.cards.concat(card)), this.hand.without(card), this.effects);
    }

    update({health = this.health}) {
        return new Player(health, this.deck, this.hand, this.effects);
    }

    withEffect(card: Card) {
        return new Player(this.health, this.deck, this.hand, this.effects.with(card));
    }

    withoutEffect(card: Card) {
        return new Player(this.health, this.deck, this.hand, this.effects.without(card));
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

