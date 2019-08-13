import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import Hand from 'components/Hand';
import Table from 'components/Table';
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import { Card, State } from './Card';


function Battle({navigation, cards }) {
    const [status, setStatus] = useState(new State());
    const [hand, setHand]: [Card[], Dispatch<SetStateAction<Card[]>>] = useState([]);

    useEffect(() => {
        setHand([cards.pop()]);
    }, []);

    const endTurn = () => {
        if(cards.length > 0) {
            setHand(hand.concat(cards.pop()));
        }
        status.hero.health -= 4;
        
        if(status.hero.health <= 0) {
            navigation.navigate('Lost');
        }
    }
    useEffect(() => {
        if(status.enemy.health <= 0) {
            navigation.navigate('Win');
        }
    });
    const play = (card: Card) => {
        status.powers.forEach(power => {
            power(card);
        });
        status.boosts.forEach(power => {
            power(card);
        });
        status.boosts = [];
        setStatus(card.effect.bind(card));
        setHand(hand.filter((cardInHand: Card) => cardInHand !== card))
    }
    return (<View style={style.container}>
        <View style={style.table}>
            <Table>
                <Text style={{alignSelf: 'center'}}>Enemy</Text>
                <Text>Health: {status.enemy.health}</Text>
                <Text style={{alignSelf: 'center'}}>Hero</Text>
                <Text>Health: {status.hero.health}</Text>
            </Table>
        </View>
        <View style={style.hand}>
            <Hand onPlay={(card: Card) => play(card)} cards={hand}></Hand>
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
        flex: 2,
        justifyContent: 'center',
        alignSelf: 'stretch'
    }
})