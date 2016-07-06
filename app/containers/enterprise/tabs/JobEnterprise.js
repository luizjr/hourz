'use strict';

import React, {
  Component
} from 'react';

import {
  View,
  Platform,
  ActionSheetIOS,
  Dimensions,
  Linking,
  Text
} from 'react-native';

import PureListView       from '../../../components/common/PureListView';
import ListContainer      from '../../../components/common/ListContainer';
import * as HBStyleSheet  from '../../../components/common/HBStyleSheet';
import { connect }        from 'react-redux';
import ActButton          from '../../../components/common/ActButton';
import Color              from '../../../resource/color'; //Importa a palheta de cores

class JobEnterprise extends Component {
  constructor() {
    super();
  }



  render() {
    const {map1, map2} = this.props;


    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.msgEmpty}>
            Empresas que tenho vinculo trabalhista
          </Text>
        </View>


      </View>
    );
  }

}

var styles = HBStyleSheet.create({
  container: {
    flex: 1
  },
  msgEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

  }
});

module.exports = JobEnterprise;
