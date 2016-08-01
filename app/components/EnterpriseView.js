import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-menu';

import HeaderView from './HeaderView';
import Color from '../resource/color';
import Typo from '../resource/typography';



class EnterpriseView extends Component {


  render() {
    let enterprise = this.props.enterprise;
    let image = enterprise.picture ? enterprise.picture : require('../resource/img/company_placeholder.png');
    return (
      <HeaderView navigator={this.props.navigator} title={enterprise.name}>
        <View style={styles.viewHeader}>
          <Image
            style={styles.placeholder}
            reiszeMode="center"
            source= {image}>

          </Image>
        </View>
        <View style={styles.viewBody}>
          <View style={styles.labelField}>
            <Text style={Typo.caption}>Token de acesso</Text>
            <Text style={Typo.body1}>{enterprise.token}</Text>
          </View>
          <View style={styles.labelField}>
            <Text style={Typo.caption}>Nº de colaboradores</Text>
            <Text style={Typo.body1}>0</Text>
          </View>
        </View>
      </HeaderView>
    );
  }
}

const styles = StyleSheet.create({
  viewHeader: {
    flex: 2,
    backgroundColor: Color.color.DimGray,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewBody: {
    flex: 2,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10
  },
  placeholder: {
    width: 240,
    height: 240,
    borderRadius: 240/2
  },
  labelField: {
    marginBottom: 20
  }
});

export default EnterpriseView;
