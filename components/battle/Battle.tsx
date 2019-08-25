import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { View, StyleSheet, Text, Button, Image, ImageBackground } from 'react-native';
import Hand from 'components/battle/Hand';
import Table from 'components/Table';
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import { Player, Encounter } from '../model/Model';
import { Card, Deck } from '../model/Cards';
import { nextEncounter } from '../cards/builds';


const CHAPTERS = 5;
function Battle({ navigation, cards, enemyCards, count = CHAPTERS }:
    { navigation: any, cards: Deck, enemyCards: Deck, count: number }) {
    // const [hero, setHero] = useState();
    // const [enemy, setEnemy] = useState();
    const [encounter, setEncounter] = useState(new Encounter(new Player(16, cards), new Player(16, enemyCards).draw()));

    const endTurn = () => {
        setEncounter(encounter.endTurn());
    }

    useEffect(() => {
        if (encounter.hero.health <= 0) {
            navigation.navigate('Lost', { cards });
        }

        if (encounter.enemy.health <= 0) {
            navigation.navigate('Win', { cards, count });
        }
    });

    return (
        <ImageBackground source={require('./street.jpg')} style={{ width: '100%', height: '100%' }}>
            <View style={style.container}>
                <Text>Chapter {CHAPTERS + 1 - count}</Text>
                <View style={style.hand}>
                    <Hand cards={encounter.enemy.hand}></Hand>
                </View>

                <View style={style.table}>
                    <Table>
                        <Text style={{ alignSelf: 'center' }}>Enemy</Text>
                        <Text>Health: {encounter.enemy.health}</Text>
                        <Text style={{ alignSelf: 'center' }}>Hero</Text>
                        <Text>Health: {encounter.hero.health}</Text>
                    </Table>
                </View>
                <View style={style.hand}>
                    <Hand onPlay={(card: Card) => setEncounter(encounter.heroPlaysCard(card))} cards={encounter.hero.hand}></Hand>
                </View>
                <Button title="end turn" onPress={() => endTurn()}></Button>
            </View>
        </ImageBackground>

    );
};

export default withMappedNavigationParams()(Battle);

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    table: {
        flex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hand: {
        height: 130,
        justifyContent: 'center',
        alignSelf: 'stretch'
    }
})