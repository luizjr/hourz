import React, { Component } from 'react';
import { View } from 'react-native';
import EnterpriseView from '../../components/EnterpriseView';
import {connect} from 'react-redux';
import { enterpriseSelector } from '../../reselect/enterprises';
import ActButton from '../../components/common/ActButton';
import Color from '../../resource/color';

class ViewEnterprise extends Component {
  _getActionButton() {
    let actionItems = [
      {
        title: 'Editar empresa',
        iconName: 'edit',
        onPress: () => this.props.navigator.push(
          {
            name: 'edit_enterprise',
            title: 'Editar empresa',
            enterprise: this.props.enterprise
          }
        )
      },
      {
        title: 'Gerar novo token',
        iconName: 'verified-user',
        onPress: () => alert('Gerar novo token')
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
