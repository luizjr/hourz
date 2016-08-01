import React, { Component, PropTypes } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  Picker
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from './button';
import Color from '../../resource/color'; //Importa a palheta de cores

class PickerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };

    this.close = this.close.bind(this);
  }
  componentDidMount

  onPress() {
    if(!this.state.selected) {
      ToastAndroid.show('Escolha um item.', ToastAndroid.SHORT);
      return;
    }
    this.close(this.state.selected);
  }

  close(value) {
    this.props.onRequestClose && this.props.onRequestClose(value);
    this.setState({selected: null});
  }

  render() {
    let items = this.props.items.length > 0 ? this.props.items : [{
      label: 'escolha...',
      value: null
    }];
    return (
      (<Modal
        ref="modal"
        animationType="fade"
        transparent={true}
        visible={this.props.isVisible}
        onRequestClose={() => this.close()}
      >
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.pickerWrapper}>
              <Text>{this.props.title}</Text>
              <Picker
                selectedValue={this.state.selected}
                onValueChange={(value) => this.setState({selected: value})}
              >
                {items.map((item) => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.buttonWrapper}>
              <Button style={styles.button} onPress={this.onPress.bind(this)}>
                <Icon name="send" style={styles.buttonIcon} />
              </Button>
            </View>
          </View>
        </View>
      </Modal>)
    );
  }
}

// Props do componente
PickerModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func,
  title: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any
  }))
};

// Valor inicial dos props
PickerModal.defaultProps = {
  isVisible: false,
  items: [{
    label: 'escolha...',
    value: null
  }]
}

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
    padding: 20
  },
  pickerWrapper: {
    flex: 3
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

export default PickerModal;
