import { Player, Action, played } from "./Player";

import { Card } from "./Cards";

export interface EncounterInterface {
    hero: Player;
    enemy: Player;
}

export class Encounter {
    constructor(readonly hero: Player, readonly enemy: Player) {
        
    }

    endTurn(): Encounter {
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

    updateHero(...callbacks: Action[]): Encounter {       
        return callbacks.reduce((acc, cb) => new Encounter(acc.hero.apply(cb), acc.enemy), this);
    }

    updateEnemy(...callbacks: Action[]): Encounter {
        return callbacks.reduce((acc, cb) => new Encounter(acc.hero, acc.enemy.apply(cb)), this);        
    }

    update({hero = this.hero, enemy = this.enemy}): Encounter {
        return new Encounter(hero, enemy);
    }

    enemyTurn(): Encounter {
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