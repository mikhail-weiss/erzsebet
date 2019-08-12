import React from 'react';

import { View, TextStyle, ViewStyle, StyleSheet } from 'react-native';

export default function({children}) {
    return (
        <View style={{flexDirection: 'column'}} >{children}</View>       
    )
}