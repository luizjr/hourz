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
import MapView from 'react-native-maps';

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
          {this._renderMap()}
        </View>
      </HeaderView>
    );
  }

  _renderMap() {
    if(!this.props.enterprise.place) {
      return (<View />);
    }
    return (
      <View style={{flex: 1}}>
        <Text style={Typo.caption}>Local</Text>
        <View style={{flex: 1}}>
          <MapView
            region={{
              ...this.props.enterprise.place,
              latitudeDelta: 0.007,
              longitudeDelta: 0.007
            }}
            zoomEnabled={false}
            rotateEnabled={false}
            scrollEnabled={false}
            pitchEnabled={false}
            style={styles.map}
          >
            <MapView.Marker
              coordinate={this.props.enterprise.place}
              title={this.props.enterprise.name}
            />
            <MapView.Circle
              center={this.props.enterprise.place}
              radius={this.props.enterprise.place.radius}
              strokeWidth={3}
              strokeColor="rgb(242, 21, 37)"
              fillColor="rgba(242, 21, 37, 0.38)"
              />
          </MapView>
        </View>
      </View>
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
  },
  map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
  }
});

export default EnterpriseView;
