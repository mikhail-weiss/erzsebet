import React, { useState } from 'react';
import { Text, View, Button, StyleSheet } from "react-native";
import { Player } from './Model';
import { nextEncounter } from './builds';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';


export const Win = withMappedNavigationParams()(({ navigation, cards, count}) => {
    count = count-1
    return (<View style={style.screen}>
        <Text style={style.message}>Win!</Text>
        {count
            ? <Button title='next' onPress={() => navigation.navigate('Battle', {cards, enemyCards: nextEncounter(), count }) } />
            : <Button title='restart' onPress={() => navigation.navigate('Home')} />
        }
    </View>)
})

export const Lost = ({ navigation }) => (
    <View style={style.screen}>
        <Text style={style.message}>you died</Text>
        <Button title='continue' onPress={() => navigation.navigate('Home')} />
    </View>
)


const style = StyleSheet.create({
    message: { fontSize: 20, textAlign: 'center', lineHeight: 40 },
    screen: { flex: 1, justifyContent: 'center' }
});