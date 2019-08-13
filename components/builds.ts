import { name } from 'components/name';
import { Card, State } from './Card';

enum Type {
    basic,
    effect
}
const buldify = (items: number[]): Card[] => items.map(num => ({
    description: `${num} damage`,
    name: name(),
    damage: num,
    effect: function (battle: State) { return Object.assign({}, battle, { enemy: { health: battle.enemy.health - this.damage } }) }

}));

const shuffle = (card: Card[]) => {
    let length = card.length;
    const shuffled: Card[] = [];
    
    for(let i = 0; i < length; i++) {
        let j = Math.floor(Math.random() * (card.length));

        shuffled.push(...card.splice(j, 1));
    }
    return shuffled;
}

export const D = (): Card[] => shuffle(buldify([4, 4, 4, 4, 4, 4]));
export const XB = (): Card[] => shuffle(buldify([1, 1, 1, 3, 8]).concat([{
    name: name(),
    damage: 0,
    description: 'Doubles next damage',
    effect: (battle: State) => {
        battle.boosts.push((card: Card) => {
            card.damage *= 2;
            return card;
        });

        return Object.assign({}, battle);
    }
}]));
export const XT = (): Card[] => shuffle(buldify([1, 1, 2, 6, 6, +2]).concat([{
    name: name(),
    damage: 0,
    description: 'Increases damage by 2',
    effect: (battle: State) => {
        battle.powers.push((card: Card) => {
            card.damage += 2;
            return card;
        });

        return Object.assign({}, battle);
    }
}]));

