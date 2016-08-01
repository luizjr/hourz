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
import HeaderView         from '../../components/HeaderView';
import PureListView       from '../../components/common/PureListView';
import ListContainer      from '../../components/common/ListContainer';
import JobJoinModal       from '../../components/JobJoinModal';
import JobEnterprise      from './tabs/JobEnterprise';
import MyEnterprise       from './tabs/MyEnterprise';
import * as HBStyleSheet  from '../../components/common/HBStyleSheet';
import { connect }        from 'react-redux';
import ActionButton       from 'react-native-action-button';
import ActButton          from '../../components/common/ActButton';
import Color              from '../../resource/color'; //Importa a palheta de cores
import {jobJoin}          from '../../actions/job';

class TabsEnterprise extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      tabSelected: 1,
      jobJoin: false
    };

    this._onJobJoinModalClose = this._onJobJoinModalClose.bind(this);
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
      case "employee":
        this.setState({
          jobJoin: true
        });
        break;
      default:
        return
    }
  }

  _onJobJoinModalClose(token) {
    console.log(token);
    this.props.jobJoin(token, this.props.user);
    this.setState({jobJoin: false});
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
      // <View style={styles.container}>
      <HeaderView
        title="Hourz"
        navigator={this.props.navigator}
      >
        {/**backgroundImage={require('./img/maps-background.png')}*/}
        <TabLayout
          style={styles.tabLayout}
          selectedTabIndicatorColor="rgb(87, 246, 198)">
          <Tab {...tab1} />
          <Tab {...tab2} />
        </TabLayout>
        {this._createSelectedView()}
          {this._getActionButton()}

        </HeaderView>
      // </View>
    );
  }

  _createSelectedView() {
    let response;
    switch (this.state.tabSelected) {
      case 1:
        response = (
          <View>
            <JobJoinModal
              isVisible={this.state.jobJoin}
              onRequestClose={this._onJobJoinModalClose} />
            <JobEnterprise
              navigator={this.props.navigator}
              jobs={this.props.jobs}
            />
          </View>
        );
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

function mapStateToProps(state) {
  return {
    user: state.user,
    jobs: state.jobReducer.jobs
  }
}

function mapDispatchToProps(dispatch) {
  return {
    jobJoin: (token, user) => dispatch(jobJoin(token, user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsEnterprise);
