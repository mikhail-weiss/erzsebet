import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Hand from 'components/Hand';
import Table from 'components/Table';
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import { Card, State } from './Card';


function Battle({navigation, cards }) {
    const [status, setStatus] = useState(new State());

    useEffect(() => {
        if(status.enemy.health <= 0) {
            navigation.navigate('Home')
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
    }
    return (<View style={style.container}>
        <View style={style.table}>
            <Table>
                <Text style={{alignSelf: 'center'}}>Enemy</Text>
                <Text>Health: {status.enemy.health}</Text>
            </Table>
        </View>
        <View style={style.hand}>
            <Hand onPlay={(card: Card) => play(card)} cards={cards}></Hand>
        </View>
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