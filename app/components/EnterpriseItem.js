import React, { Component } from 'react';
import {
  Alert,
  PropTypes,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from './common/Touchable';
import moment from 'moment';
import ptBr from 'moment/locale/pt-br';


/**
 * Componente chamado pelo PointList para renderizar cada ponto batido
 */
class EnterpriseItem extends Component {

  // _onViewPress() {
  //   this.context.onViewPress && this.context.onViewPress(this.props.enterprise)
  // }
  //
  // _onEditPress() {
  //   this.context.onEditPress && this.context.onEditPress(this.props.enterprise)
  // }
  //
  // _onLocationPress() {
  //   this.context.onLocationPress && this.context.onLocationPress(this.props.enterprise)
  // }

  /**
   * Renderiza o componente
   * @return {ReactElement}
   */
  render() {

    // recebe estilo definido no props
    let style = this.props.style || {};
    let edited = this.props.enterprise.edited ? '*': '';

    return (
      <View style={[styles.container, ...style]}>


        {/*Nome*/}
        <View style={styles.timeWrapper}>
          <Text style={styles.time}>{this.props.enterprise.name}</Text>
        </View>

      </View>
    );
  }
}

// Props do componente
EnterpriseItem.propTypes = {
  enterprise: PropTypes.object.isRequired
}

EnterpriseItem.contextTypes = {
  onEditPress: PropTypes.func,
  onViewPress: PropTypes.func,
  onLocationPress: PropTypes.func,
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  },
  icon: {
    fontSize: 20
  },
  fluxIconWrapper: {
    flex: 1,
    alignItems: 'center'
  },
  iconIn: {
    color: 'green'
  },
  iconOut: {
    color: 'red'
  },

  timeWrapper: {
    flex: 5,
    paddingHorizontal: 5
  },
  time: {
    fontSize: 20
  },

  buttonsGroupWrapper: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:50,
    backgroundColor: 'rgba(170, 180, 182, 0.64)'
  },
  iconLocation: {
    color: 'red'
  }
});

export default EnterpriseItem;
