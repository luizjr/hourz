import React, { Component, PropTypes } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';

import Header from './common/Header';
import Color from '../resource/color';

class HeaderView extends Component {

  _getLeftItem() {
    if (this.props.navigator.getCurrentRoutes().length > 1) {
      return {
        layout: 'icon',
        title: 'Close',
        icon: require('./common/BackButtonIcon'),
        onPress: () => this.props.navigator.pop()
      };
    }
    return {
      layout: 'icon',
      title: 'Menu',
      /**
       * Ao passar um numero maior que zero muda
       * o icone indicando que á notificações
       */
      icon: 0 ?
        require('../resource/img/hamburger-unread.png') : require('../resource/img/hamburger.png'),
      onPress: () => this.context.openDrawer && this.context.openDrawer(),
    };
  }

  render() {
    let color = this.props.headerColor || Color.color.PrimaryColor;
    let headerStyle = {backgroundColor: color};
    if(this.props.headerStyle) {
      headerStyle = {
        ...headerStyle,
        ...this.props.headerStyle
      }
    }

    let style = this.props.style || {}

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={color}
          barStyle="light-content"
        />
        <Header
          {...this.props}
          leftItem={this._getLeftItem()}
          children={null}
          style={[headerStyle]}
        />
        <View style={[styles.body, style]}>
          {this.props.children}
        </View>
      </View>
    );
  }
}

HeaderView.propTypes = {
  headerColor: PropTypes.string,
  headerStyle: PropTypes.object,
  navigator: PropTypes.object.isRequired
}

HeaderView.contextTypes = {
  openDrawer: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  body : {
    flex: 1
  }
});

export default HeaderView;
