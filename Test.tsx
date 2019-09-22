import { XB, XT, D, nextCard } from 'components/cards/builds';
import { Card, Deck, HigherOrderCard, ShuffableDeck } from "components/model/Cards";
import { Encounter, Player } from "components/model/Model";
import { registerRootComponent } from 'expo';
import { activateKeepAwake } from 'expo-keep-awake';
import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Histogram from 'components/react-native-histogram/Histogram';


if (__DEV__) {
  activateKeepAwake();
}

const DECK_SIZE = 6;

interface TestResult {
  max: number;
  min: number;
  mid: number;
  deck: Deck;

  fitness?: number;
}

const generateDeck = (): Deck => {
  const cards = [] as Card[];
  for(let i = 0; i < DECK_SIZE; i++) {
    cards.push(nextCard(Math.ceil(Math.random()*4)));
  }
  return new ShuffableDeck(cards);

}
const initial = (): Deck[] => {
  const result = [] as Deck[];
  for(let i = 0; i < 10; i++) {
    result.push(generateDeck());
  }

  return result;

}
export default function Test() {

  const [currentState, setResult] = useState();
  const [fitness, setFitness] = useState();
  const [decks, setDecks] = useState(initial());

  useEffect(() => {      
    const result = [] as TestResult[];
    let newDecks = [] as Deck[];
    for (const deck of decks) {
      result.push(calcFitness(testMyDeck(deck)));
    }

    result.sort((a1, a2) => -a1.fitness + a2.fitness);

    setResult(result);
    setFitness(result.map(res => res.fitness));

    const top = result.slice(0, 6);

    newDecks = top.map(result => result.deck);

    newDecks.push(new ShuffableDeck([...top[0].deck.cards.slice(0,DECK_SIZE/2-1), ...top[4].deck.cards.slice(0,DECK_SIZE/2-1), nextCard(Math.ceil(Math.random()*4)), nextCard(Math.ceil(Math.random()*4))]));
    newDecks.push(new ShuffableDeck([...top[1].deck.cards.slice(0,DECK_SIZE/2-1), ...top[3].deck.cards.slice(0,DECK_SIZE/2-1), nextCard(Math.ceil(Math.random()*4)), nextCard(Math.ceil(Math.random()*4))]));
    newDecks.push(new ShuffableDeck([...top[2].deck.cards.slice(0,DECK_SIZE/2-1), ...top[0].deck.cards.slice(0,DECK_SIZE/2-1), nextCard(Math.ceil(Math.random()*4)), nextCard(Math.ceil(Math.random()*4))]));
    newDecks.push(new ShuffableDeck([...top[3].deck.cards.slice(0,DECK_SIZE/2-1), ...top[0].deck.cards.slice(0,DECK_SIZE/2-1), nextCard(Math.ceil(Math.random()*4)), nextCard(Math.ceil(Math.random()*4))]));
    newDecks.push(new ShuffableDeck([...top[4].deck.cards.slice(0,DECK_SIZE/2-1), ...top[1].deck.cards.slice(0,DECK_SIZE/2-1), nextCard(Math.ceil(Math.random()*4)), nextCard(Math.ceil(Math.random()*4))]));

    setDecks(newDecks);
  });

  return (
    <View>
      <Text>{JSON.stringify(fitness)}</Text>
      <Text>{JSON.stringify(currentState)}</Text>
    </View>
  );
}
registerRootComponent(Test);

const calcFitness = (test: TestResult) => {
  return Object.assign({}, test, { fitness: test.max - test.mid})
}



function testMyDeck(deck: Deck): TestResult {
  console.log(`Testing deck ${deck}`);

  let bestcard = { damage: 0, card: undefined }
  deck.map((card: Card) => {
    let testDeck = [];
    for (let i = 0; i < deck.length; i++) {
      testDeck.push(new HigherOrderCard(card));
    }
    let damage = Math.abs(testRun(new ShuffableDeck(testDeck)));
    if (bestcard.damage < damage) {
      bestcard.damage = damage;
      bestcard.card = card;
    }
  });

  console.log(`Strongest card is ${bestcard.damage}`);

  let shuffles = shuffle(deck);

  console.log(`start: ${new Date()}`);
  const superResult = shuffles
    .map(shuffle => testRun(new ShuffableDeck(shuffle)))
    .reduce(
      (acc: { max: number, min: number }, current: number) => ({ max: Math.max(acc.max, current), min: Math.min(acc.min, current) }),
      { max: 0, min: 1000000 });

  console.log(superResult);
  console.log(`end: ${new Date()}`);
  return {...superResult, mid: bestcard.damage, deck};
}


function testRun(deck: Deck): number {
  let encounter = new Encounter(new Player(0, deck), new Player(0, deck));

  while (encounter.hero.deck.length > 0) {
    encounter = encounter.hero.effects.reduce((encounterUpdate, card) => card.endTurn(encounterUpdate), encounter);
    encounter = encounter.update({ hero: encounter.hero.draw() });

    let card = encounter.hero.hand.draw();
    encounter = encounter.heroPlaysCard(card);

    encounter = encounter.hero.effects.reduce((encounterUpdate, card) => card.beginTurn(encounterUpdate), encounter);
  }

  return Math.abs(encounter.enemy.health);
}


function shuffle(deck: Deck): Card[][] {
  let result: Card[][] = [];

  if (deck.length === 1) {
    return [[deck.draw()]];
  }
  for (let i = 0; i < deck.length; i++) {
    const card = deck.draw(i);

    let shuffles = shuffle(deck.without(card));

    for (let shuffle of shuffles) {
      result.push([card].concat(shuffle));
    }

  }

  return result;
}
