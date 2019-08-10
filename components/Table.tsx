import { Text, TextStyle, ViewStyle, StyleSheet } from 'react-native';
import React from 'react';

export default function({children}) {
    return (
        <Text>Hello{children}</Text>       
    )
}