'use strict';

import React from 'react';
import { Animated, LayoutAnimation, Text, TouchableWithoutFeedback } from 'react-native';
import { AnimatedValue } from 'react-navigation';
import Style from './Style';


type state = {
  value: number,
  color: AnimatedValue,
  onFocusBar: boolean,
}

class Props {
  value: number = 0;
  magnification: number;
  width: number;
}
export default class Bar extends React.Component<Props, state> {

  componentDidMount() {
  }
  _onTouchStart = () => {
    Animated.timing(this.state.color, {
      toValue: 1,
      duration: 180,
    }).start()
  }
  _onRelease = () => {
    Animated.timing(this.state.color, {
      toValue: 0,
      duration: 180,
    }).start()
  }

  render() {
    LayoutAnimation.spring();
    return (
      <TouchableWithoutFeedback onPressIn={this._onTouchStart} onPressOut={this._onRelease}>
        <Animated.View style={
          [
            Style.bar,
            {
              backgroundColor: this.state.color.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgb(0, 122, 255)', '#62aeff']
              }),
              width: this.props.width,
            },
            {
              height: this.props.value,
            }
          ]
        }
        >
          <Text style={Style.barText}> {this.props.value / this.props.magnification} </Text>

        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}