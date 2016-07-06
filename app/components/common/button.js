import React, { Component, PropTypes } from 'react';
import {
  Text, StyleSheet, View
} from 'react-native';
import Touchable from './Touchable';

/**
 * Componente botão
 */
class Button extends Component {

  /**
   * Renderiza o componente
   * @return {ReactElement}
   */
  render() {
    let viewStyle = this.props.style || {};
    return (
      <Touchable onPress={this.props.onPress}>
        <View style={[styles.button, viewStyle]}>
          {this.props.children}
        </View>
      </Touchable>
    );
  }
}

// Props do componente
Button.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.any
}

// Estilos do componente
const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingVertical: 8,
    elevation: 2
  }
});

export default Button;
