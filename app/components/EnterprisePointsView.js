import React, { Component, PropTypes } from 'react';
import {
  ListView,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import HeaderView from './HeaderView';
import Color from '../resource/color';
import Typo from '../resource/typography';

class EnterprisePointsView extends Component {
  render() {
    let enterprise = this.props.enterprise;
    return (
      <HeaderView
        navigator={this.props.navigator}
        title={`${enterprise.name} - Pontos`}
        subtitle="agosto/2016"
      >

      </HeaderView>
    );
  }
}

export default EnterprisePointsView;
