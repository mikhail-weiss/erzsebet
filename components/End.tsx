import React from 'react';
import { Text, View, Button, StyleSheet } from "react-native";

export const Win = ({navigation}) => (
    <View style={style.screen}>
        <Text style={style.message}>Win</Text>
        <Button title='restart' onPress={() => navigation.navigate('Home')} />
    </View>
)


export const Lost = ({navigation}) => (
    <View style={style.screen}>
        <Text style={style.message}>you died</Text>
        <Button title='continue' onPress={() => navigation.navigate('Home')} />
    </View>
)

const style = StyleSheet.create({
    message: { fontSize: 20, textAlign: 'center', lineHeight: 40 },
    screen: {flex: 1, justifyContent: 'center'}
});