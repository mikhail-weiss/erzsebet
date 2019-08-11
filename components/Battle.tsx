import React from 'react';
import { View, StyleSheet } from 'react-native';
import Hand from 'components/Hand';
import Table from 'components/Table';
import { withMappedNavigationParams } from 'react-navigation-props-mapper'

const Battle = ({ cards }) => (
    <View style={style.container}>
        <View style={style.table}>
            <Table>Lena</Table>
        </View>
        <View style={style.hand}>
            <Hand cards={cards}></Hand>
        </View>
    </View>
);


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