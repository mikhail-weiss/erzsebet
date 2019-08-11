import React from 'react';

import { Text, TextStyle, ViewStyle, StyleSheet } from 'react-native';

export default function({children}) {
    return (
        <Text>Hello {children}</Text>       
    )
}