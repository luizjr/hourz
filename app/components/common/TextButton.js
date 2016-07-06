import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import Button from './button';

class TextButton extends Component {
  render() {
    let viewStyle = this.props.style || {};
    let textStyle = this.props.textStyle || {};

    return (
      <Button onPress={this.props.onPress} style={viewStyle}>
        <Text style={[styles.buttonText, textStyle]}>
          {this.props.title}
        </Text>
      </Button>
    );
  }
}

// Estilos do componente
const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121'
  }
});

export default TextButton;
