import React, { Component, PropTypes } from 'react';
import {
  ListView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderView from './HeaderView';
import Color from '../resource/color';
import Typo from '../resource/typography';

class EnterprisePointsView extends Component {

  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: dataSource
    };
  }

  componentDidMount() {
    let days = Object.keys(this.props.points).sort();
    console.log(this.props.points);

    this.setState({
      dataSource : this.state.dataSource.cloneWithRows(days)
    });
  }

  componentWillReceiveProps(newProps) {
    let days = Object.keys(newProps.points).sort();
    // console.log(this.props.points);
    this.setState({
      dataSource : this.state.dataSource.cloneWithRows(days)
    });
  }

  renderRow(value, idSec, idRow) {
    let points = Object.keys(this.props.points[value]);
    // let day = moment(this.props.)
    return (
      <View key={value}>
        <View style={{
          backgroundColor: 'gray',
        }}>
          <Text style={{
            color: 'white',
            fontSize: 20
          }}>
            {value}
          </Text>
        </View>
        <View>
          {points.map(key => {
            let point = this.props.points[value][key];
            let {hour, minute} = point;
            let time = moment({hour, minute}).format('HH:mm');
            let iconStyle = point.pointType === 'in' ? styles.iconIn : styles.iconOut;
            let edited = point.edited ? '*': '';
            // let user = this.props.enterprise ? this.props.enterprise.employees.find(value => value.id = point.userId) : null;
            return (
              <View key={key} style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 10
              }}>
                <View style={styles.fluxIconWrapper}>
                  <Icon name='fingerprint' style={[styles.icon, iconStyle]} />
                </View>
                <View style={styles.timeWrapper}>
                  <Text style={styles.time}>{time}{edited}</Text>
                  <Text>{}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  render() {
    let {month, year} = this.props.month;
    let enterprise = this.props.enterprise;
    return (
      <HeaderView
        navigator={this.props.navigator}
        title={`${enterprise.name} - Pontos`}
        subtitle={moment({month, year}).format('MMMM/YYYY')}
      >
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          style={styles.listView}
          enableEmptySections={true}
        />
      </HeaderView>
    );
  }
}

// Estilo do componente
var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listView: {
      // backgroundColor: 'yellow'
    },
    icon: {
      fontSize: 20
    },
    fluxIconWrapper: {
      flex: 1,
      alignItems: 'center'
    },
    iconIn: {
      color: 'green'
    },
    iconOut: {
      color: 'red'
    },

    timeWrapper: {
      flex: 5,
      paddingHorizontal: 5
    },
    time: {
      fontSize: 20
    },

    buttonsGroupWrapper: {
      flex: 3,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    button: {
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius:50,
      backgroundColor: 'rgba(170, 180, 182, 0.64)'
    },
    iconLocation: {
      color: 'red'
    }
});

export default EnterprisePointsView;
