import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { View, StyleSheet, Text, Button, Image, ImageBackground } from 'react-native';
import Hand from 'components/battle/Hand';
import Table from 'components/Table';
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import { Player, Encounter } from '../model/Model';
import { Card, Deck } from '../model/Cards';
import { nextEncounter } from '../cards/builds';


interface BattleProps { navigation: any, deck: Deck, enemyCards: Deck, count: number };
const CHAPTERS = 5;
function Battle({ navigation, deck, enemyCards, count = CHAPTERS }: BattleProps) {
    // const [hero, setHero] = useState();
    // const [enemy, setEnemy] = useState();
    let hero = new Player(Math.ceil(deck.length*2), deck);
    const [encounter, setEncounter] = useState(new Encounter(hero.draw(), new Player(Math.ceil(deck.length*2), enemyCards).draw()));

    const endTurn = () => {
        setEncounter(encounter.endTurn());
    }

    useEffect(() => {
        if (encounter.hero.health <= 0) {
            navigation.navigate('Lost', { deck });
        }

        if (encounter.enemy.health <= 0) {
            navigation.navigate('Win', { deck, count });
        }
    });

    return (
        <ImageBackground source={require('./street.jpg')} style={{ width: '100%', height: '100%' }}>
            <View style={styles.container}>
                <Text>Chapter {CHAPTERS + 1 - count}</Text>
                <View style={styles.hand}>
                    <Hand cards={encounter.enemy.hand}></Hand>
                </View>

                <View style={styles.table}>
                    <Table>
                        <Text style={{ alignSelf: 'center' }}>Enemy</Text>
                        <Text>Health: {encounter.enemy.health}</Text>
                        <Text style={{ alignSelf: 'center' }}>Hero</Text>
                        <Text>Health: {encounter.hero.health}</Text>
                    </Table>
                </View>
                <View style={styles.hand}>
                    <Hand onPlay={(card: Card) => setEncounter(encounter.heroPlaysCard(card))} cards={encounter.hero.hand}></Hand>
                </View>
                <Button title="end turn" onPress={() => endTurn()}></Button>
            </View>
        </ImageBackground>

    );
};

export default withMappedNavigationParams()(Battle);

const styles = StyleSheet.create({
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