type Effect = (battle: State) => State;
type Power = (card: Card) => Card;

export class Card {
    name: string;
    description: string;
    effect: Effect;
    damage: number;
}

export class State {
    hero = { health: 16 };
    enemy = { health: 16 };
    powers: Power[] = []
    boosts: Power[] = []

}
