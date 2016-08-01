import React, { Component, PropTypes } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View
} from 'react-native';
import Color from '../resource/color'; //Importa a palheta de cores
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Button from './common/button';

/**
 * Componente que abre um modal para visualizar a imagem do ponto registrado
 *
 */
class JobJoinModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      token: '',
    }

    this.close = this.close.bind(this);
  }

  close(token) {
    this.props.onRequestClose(token);
    this.setState({token: ''});
  }

  onPress() {
    if(!this.state.token) {
      ToastAndroid.show('Campo Obrigatório', ToastAndroid.LONG);
      return;
    }
    this.close(this.state.token);

  }

  /**
   * Renderiza o componente
   * @return {ReactElement}
   */
  render() {

    return (
      <Modal
        ref="modal"
        animationType="fade"
        transparent={true}
        visible={this.props.isVisible}
        onRequestClose={() => this.close()}
      >
        <View style={styles.container}>
          <View style={[styles.innerContainer]}>
            <TextInput
              autoFocus={true}
              multiline={true}
              numberOfLines={3}
              placeholder="Insira o token"
              style={styles.input}
              value={this.state.token}
              onChangeText={(text) => this.setState({token: text})}
            />
            <View style={styles.buttonWrapper}>
              <Button style={styles.button} onPress={this.onPress.bind(this)}>
                <Icon name="send" style={styles.buttonIcon} />
              </Button>
            </View>
          </View>
        </View>

      </Modal>
    );
  }
}

// Props do componente
JobJoinModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

// Valor inicial dos props
JobJoinModal.defaultProps = {
  isVisible: false
}

// Estilo do componente
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(154, 154, 154, 0.55)',
    padding: 20
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20
  },
  input: {
      flex: 4,
      padding: 4,
      height: 100,
      borderColor: 'gray',
      alignSelf: 'center'
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: Color.color.AccentColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonIcon: {
    fontSize: 28,
    color: 'white'
  },
  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  rowTitle: {
    flex: 1,
    fontWeight: 'bold',
  }
});

export default JobJoinModal;
