'use strict';

import React, {
  Component
} from 'react';

import {
  View,
  Platform,
  ActionSheetIOS
} from 'react-native';

import PureListView       from '../../components/common/PureListView';
import ListContainer      from '../../components/common/ListContainer';
import JobEnterprise      from './tabs/JobEnterprise';
import MyEnterprise       from './tabs/MyEnterprise';
import * as HBStyleSheet  from '../../components/common/HBStyleSheet';
import { connect }        from 'react-redux';
import ActionButton       from 'react-native-action-button';
import Color              from '../../resource/color'; //Importa a palheta de cores

class TabsEnterprise extends Component {
  constructor() {
    super();
  }


  /**
   * bater o ponto
   * @param  {string} type -> 'in' | 'out'
   * @return {void}
   */
  _onClick() {
    this.props.navigator.push(
    {name: 'new_report', title: 'Empresa nova'}
    );
  }


  render() {

    let pointItem = {
      color: '#1abc9c',
      title: 'Entrada',
      icon: 'keyboard-arrow-right',
      type: 'in'
    };

    let actionItem = {
      buttonColor: pointItem.color,
      title: pointItem.title,
      iconName: pointItem.icon
    }


    return (
      <View style={styles.container}>
        {/**backgroundImage={require('./img/maps-background.png')}*/}
        <ListContainer
          title="Empresas"
          backgroundColor={Color.color.PrimaryColor}>
          
          <PureListView
            title='Meus trabalhos'
            renderEmptyList={() => <JobEnterprise />}
          />
          <PureListView
            title='Minhas Empresas'
            renderEmptyList={() => <MyEnterprise />}
          />
        </ListContainer>


        {/*Action Button*/}
        <ActionButton
          buttonColor={Color.color.AccentColor}
          onPress={this._onClick.bind(this)} />

      </View>
    );
  }

}

var styles = HBStyleSheet.create({
  container: {
    flex: 1,
  }
});

module.exports = TabsEnterprise;
