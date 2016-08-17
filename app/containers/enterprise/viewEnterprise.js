import React, { Component } from 'react';
import { Clipboard, ToastAndroid, View } from 'react-native';
import EnterpriseView from '../../components/EnterpriseView';
import {connect} from 'react-redux';
import { enterpriseSelector } from '../../reselect/enterprises';
import ActButton from '../../components/common/ActButton';
import Color from '../../resource/color';
import getBaseRef from '../../env';

const database = getBaseRef().database();

class ViewEnterprise extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    this.usersRef = database.ref(`enterprise/${this.props.enterprise.key}`);
  }
  _getActionButton() {
    let actionItems = [
      {
        title: 'Editar empresa',
        iconName: 'edit',
        onPress: () => this.props.navigator.push(
          {
            name: 'edit_enterprise',
            title: 'Editar empresa',
            enterprise: this.props.enterprise,
            type: 'name'
          }
        )
      },
      {
        title: 'Editar ponto',
        iconName: 'place',
        onPress: () => this.props.navigator.push(
          {
            name: 'edit_enterprise',
            title: 'Editar empresa',
            enterprise: this.props.enterprise,
            type: 'point'
          }
        )

      },
      {
        title: 'Copiar token',
        iconName: 'content-copy',
        onPress: () => {
          Clipboard.setString(`${this.props.enterprise.token}`);
          ToastAndroid.show('Copiado para o clipboard', ToastAndroid.SHORT);

        }
      }
    ];
    return (
      <ActButton
        buttonColor={Color.color.AccentColor}
        actionItems={actionItems}
      />
    );
  }

  render() {
    console.log(this.props.route.enterprise);
    console.log(this.props.enterprise);
    return (
      <View style={{flex:1}}>
        <EnterpriseView enterprise={this.props.enterprise} navigator={this.props.navigator}/>
        {this._getActionButton()}
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    enterprise: enterpriseSelector(state, props.route.enterprise)
  };
}

export default connect(mapStateToProps)(ViewEnterprise);
