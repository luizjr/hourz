import React, {
  Component,
  PropTypes
} from 'react';

import {
  View,
  Alert,
  Platform,
  ActionSheetIOS,
  Dimensions,
  Linking,
  Text
} from 'react-native';

import * as HBStyleSheet  from './common/HBStyleSheet';
import ProgressBar        from './common/ProgressBar';
import EnterpriseList     from './EnterpriseList';
import ActButton          from './common/ActButton';
import HeaderView         from './HeaderView';
import Color              from '../resource/color'; //Importa a palheta de cores

class EnterpriseHomeView extends Component {
  render() {
    return (
      <HeaderView
        title="Minhas Empresas"
        navigator={this.props.navigator}
        route={this.props.route}
      >
        <View style={styles.container}>
            <EnterpriseList
              enterprises={this.props.enterprises}
              />
        </View>
      </HeaderView>
    );
  }
}

var styles = HBStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
});

export default EnterpriseHomeView;
