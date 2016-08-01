import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Touchable from './common/Touchable';
import typoStyle from '../resource/typography';
import Color from '../resource/color';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * Componente que renderiza cada linha do menu lateral
 */
class MenuItem extends Component {
  render() {
    let icon = "home";
    if (this.props.icon) {
      icon = this.props.icon;
    }

    let badge;
    if (this.props.badge) {
      badge = (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {this.props.badge}
          </Text>
        </View>
      );
    }

    var selectedTitleStyle = this.props.selected && styles.selectedTitle;
    var selectedIconStyle = this.props.selected && styles.selectedIcon;
    return (
      <Touchable onPress={this.props.onPress}>
        <View style={styles.container}>
          <View style={styles.menuLineWrapper}>
            <Icon name={icon} style={[styles.icon, selectedIconStyle]} />
          </View>
          <View style={styles.menuLineWrapper}>
            <Text style={[typoStyle.menu, selectedTitleStyle]}>{this.props.title}</Text>
          </View>
          {badge}
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',

  },
  menuLineWrapper: {
    height: 50,
    justifyContent: 'center',
    marginLeft: 16
  },
  icon: {
    marginRight: 20,
    marginBottom: 6,
    color: Color.color.SecondText,
    fontSize: 25
  },
  selectedIcon: {
    color: '#4285f4'
  },
  selectedTitle: {
    color: '#4285f4'
  },
  badge: {
    backgroundColor: '#DC3883',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    color: 'white',
  },
});

export default MenuItem;
