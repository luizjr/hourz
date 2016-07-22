'use strict';

import React, {
  Component,
  PropTypes
} from 'react';

import {
  View,
  Platform,
  ActionSheetIOS,
  Text
} from 'react-native';
import { Tab, TabLayout } from 'react-native-android-tablayout';
import Header from '../../components/common/Header';
import PureListView       from '../../components/common/PureListView';
import ListContainer      from '../../components/common/ListContainer';
import JobEnterprise      from './tabs/JobEnterprise';
import MyEnterprise       from './tabs/MyEnterprise';
import * as HBStyleSheet  from '../../components/common/HBStyleSheet';
import { connect }        from 'react-redux';
import ActionButton       from 'react-native-action-button';
import ActButton          from '../../components/common/ActButton';
import Color              from '../../resource/color'; //Importa a palheta de cores

class TabsEnterprise extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      tabSelected: 1
    };
  }


  /**
   * bater o ponto
   * @param  {string} type -> 'in' | 'out'
   * @return {void}
   */
  _onPress(type) {
    switch (type) {
      case "enterprise":
        this.props.navigator.push(
          {name: 'new_enterprise', title: 'Empresa nova'}
        );
        break;
      default:
        return
    }
  }

  _getActionButton() {
    let title = this.state.tabSelected == 2 ? "Cadastrar Empresa" : "Procurar Empresa";
    let iconName = this.state.tabSelected == 2 ? "business": "search";
    let type = this.state.tabSelected == 2 ? "enterprise": "employee";
    let actionItem = {
      buttonColor: '#1abc9c',
      title ,
      iconName,
      onPress: this._onPress.bind(this, type)
    }
    return (
      <ActButton
        buttonColor={Color.color.AccentColor}
        actionItems={[actionItem]}
      />
    );
  }


  render() {
    let leftItem = {
        title: 'Menu',

        /**
         * Ao passar um numero maior que zero muda
         * o icone indicando que á notificações
         */
        icon: 0
          ? require('../../resource/img/hamburger-unread.png')
          : require('../../resource/img/hamburger.png'),
        onPress: this._handleShowMenu.bind(this),
      };

      let tab1 = {
        name: "Meus trabalhos",
        accessibilityLabel: "employee",
        onTabSelected: () => {this.setState({tabSelected: 1})},
        textColor: this.state.tabSelected == 1 ? 'rgb(87, 246, 198)' : 'white'
      };
      let tab2 = {
        name: "Minhas empresas",
        accessibilityLabel: "enterprise",
        onTabSelected: () => {this.setState({tabSelected: 2})},
        textColor: this.state.tabSelected == 2 ? 'rgb(87, 246, 198)' : 'white'
      };

    return (
      <View style={styles.container}>
      <Header
        style={styles.header}
        title="Hourz"
        leftItem={leftItem}
      >
      </Header>
        {/**backgroundImage={require('./img/maps-background.png')}*/}
        <TabLayout
          style={styles.tabLayout}
          selectedTabIndicatorColor="rgb(87, 246, 198)">
          <Tab {...tab1} />
          <Tab {...tab2} />
        </TabLayout>
        {this._createSelectedView()}
        {/*<ListContainer
          title="Empresas"
          backgroundColor={Color.color.PrimaryColor}>

          <PureListView
            title='Meus trabalhos'
            renderEmptyList={() => <JobEnterprise />}
            renderRow={(point, idSec, idRow) => {}}
          />
          <PureListView
            title='Minhas Empresas'
            renderEmptyList={() => <MyEnterprise />}
            renderRow={(point, idSec, idRow) => {}}
          />
        </ListContainer>*/}


        {/*Action Button*/}
        {/*<ActionButton
          buttonColor={Color.color.AccentColor}
          onPress={this._onPress.bind(this)} />*/}
          {this._getActionButton()}

      </View>
    );
  }

  _createSelectedView() {
    let response;
    switch (this.state.tabSelected) {
      case 1:
        response = <JobEnterprise navigator={this.props.navigator}/>;
        break;
      case 2:
        response = <MyEnterprise navigator={this.props.navigator}/>
    }
    return (
      <View style={styles.container}>
        {response}
      </View>
    );
  }

  _handleShowMenu() {
    this.context.openDrawer();
  }

}

TabsEnterprise.contextTypes = {
  openDrawer: PropTypes.func
};

var styles = HBStyleSheet.create({
  container: {
    flex: 1,
  },
  tabLayout: {
    backgroundColor: Color.color.PrimaryColor
  },
  header: {
    android: {
      backgroundColor: Color.color.PrimaryColor,
    },
  },
  content: {
    padding: 10
  },
});

module.exports = TabsEnterprise;
