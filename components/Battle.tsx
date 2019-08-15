import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { View, StyleSheet, Text, Button, StatusBar } from 'react-native';
import Hand from 'components/Hand';
import Table from 'components/Table';
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import { Card, Player } from './Model';


function Battle({ navigation, cards, enemyCards }) {
    const [hero, setHero] = useState(new Player(16, cards));
    const [enemy, setEnemy] = useState(new Player(16, enemyCards));

    const endTurn = () => {
        let newHero = hero.endTurn();
        let newEnemy = enemy;
        let card = enemy.hand[enemy.hand.length-1];
        if(card) {
            [newEnemy, newHero] = play(card, enemy, newHero);
        }
        
        newEnemy = newEnemy.endTurn();
        setHero(newHero);
        setEnemy(newEnemy);
    }
    useEffect(() => {
        if (hero.health <= 0) {
            navigation.navigate('Lost');
        }

        if (enemy.health <= 0) {
            navigation.navigate('Win');
        }
    });

    const play = (card: Card, hero: Player, enemy: Player) => {
        let newHero = hero.play(card);
        let newEnemy = enemy;
        return card.effect.call(card, newHero, newEnemy);
    }

    const heroCard = (card: Card) => {
        const [newHero, newEnemy] = play(card, hero, enemy);
        setHero(newHero);
        setEnemy(newEnemy);
    }

    return (<View style={style.container}>
        <View style={style.hand}>
            <Hand onPlay={(card: Card) => undefined} cards={enemy.hand}></Hand>
        </View>

        <View style={style.table}>
            <Table>
                <Text style={{ alignSelf: 'center' }}>Enemy</Text>
                <Text>Health: {enemy.health}</Text>
                <Text style={{ alignSelf: 'center' }}>Hero</Text>
                <Text>Health: {hero.health}</Text>
            </Table>
        </View>
        <View style={style.hand}>
            <Hand onPlay={(card: Card) => heroCard(card)} cards={hero.hand}></Hand>
        </View>
        <Button title="end turn" onPress={() => endTurn()}></Button>
    </View>
    )

};

export default withMappedNavigationParams()(Battle);

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    table: {
        flex: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hand: {
        height: 130,
        justifyContent: 'center',
        alignSelf: 'stretch'
    }
})