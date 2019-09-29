import { Card, Deck, ShuffableDeck } from "./Cards";

export interface EncounterInterface {
    hero: Player;
    enemy: Player;
}

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

    apply(cb: (props: EncounterInterface) => EncounterInterface): Encounter {
        return this.update(cb(this))        
    }

    updateHero(cb: Action) {
        return new Encounter(this.hero.apply(cb), this.enemy);
    }

    updateEnemy(cb: Action) {
        return new Encounter(this.hero, this.enemy.apply(cb));
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
            enemyView = enemyView.updateHero(played(card))
        }

        enemyView = enemyView.hero.effects.reduce((encounterUpdate, card) => card.endTurn(encounterUpdate), enemyView);    
        return new Encounter(enemyView.enemy, enemyView.hero);
    }

    heroPlaysCard(card: Card): Encounter {
        if (!card) return this;
        let playing: Card = this.hero.effects.reduce((finalCard: Card, effect: Card) => effect.cardPlayed(finalCard), card);
        let nextEncounter = playing.play(this);        
        return nextEncounter.updateHero(played(card));
    }
}

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

export const damage = (dmg: number): Action => ({health}) => ({health: health - dmg});
export const withoutEffect = (card: Card): Action => ({effects}) => ({effects: effects.without(card)});
export const withEffect = (card: Card): Action => ({effects}) => ({effects: effects.with(card)});
export const played = (card: Card): Action => ({deck, hand}) => ({deck: new ShuffableDeck(deck.cards.concat(card)), hand: hand.without(card)});
