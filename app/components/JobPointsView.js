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
import Touchable from './common/Touchable';
import Color from '../resource/color';
import Typo from '../resource/typography';
import ActionButton from 'react-native-action-button';

class JobPointsView extends Component {

  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: dataSource,
      days: [],
      enterprise: {
        employees: []
      }
    };
  }

  componentDidMount() {
    let days = Object.keys(this.props.points).sort();

    this.setState({
      dataSource : this.state.dataSource.cloneWithRows(days),
      days
    });
  }

  componentWillReceiveProps(newProps) {
    let days = Object.keys(newProps.points).sort();
    this.setState({
      dataSource : this.state.dataSource.cloneWithRows(days),
      days,
      enterprise: newProps.enterprise
    });
  }

  _onViewPress(point) {
    this.context.onViewPress && this.context.onViewPress(point)
  }

  _onEditPress(point) {
    this.context.onEditPress && this.context.onEditPress(point)
  }

  _onLocationPress(point) {
    this.context.onLocationPress && this.context.onLocationPress(point)
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
            let user = this.state.enterprise.employees[point.userId];
            if(!user) {
              user = this.props.user.id === point.userId ? this.props.user : {name:''};
            }
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
                  <Text>{user.name}</Text>
                </View>
                {/*Botões*/}
                <View style={styles.buttonsGroupWrapper}>

                  {/*botão de localização*/}
                  {/* <Touchable
                    onPress={this._onLocationPress.bind(this, point)}
                  >
                    <View style={styles.button}>
                      <Icon
                        name="my-location"
                        style={[styles.icon, styles.iconLocation]} />
                    </View>
                  </Touchable> */}

                  {/*botão de editar*/}
                  <Touchable
                    onPress={this._onEditPress.bind(this, point)}
                  >
                    <View style={styles.button}>
                      <Icon name="edit" style={styles.icon} />
                    </View>
                  </Touchable>

                  {/*Botão de visualização*/}
                  <Touchable
                    onPress={this._onViewPress.bind(this, point)}
                  >
                    <View style={styles.button}>
                      <Icon name="remove-red-eye" style={styles.icon} />
                    </View>
                  </Touchable>
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
        rightItem={{
          layout: 'icon',
          title: 'Filter',
          icon: require('../resource/img/filter.png'),
          onPress: () => alert('Filtro')
        }}
      >
        <ScrollView
          style={styles.listView}
        >
          {this.state.days.map(this.renderRow.bind(this))}
        </ScrollView>
        <ActionButton onPress={() => alert('gerando relatorio')}
        icon={<Icon name='show-chart' style={{color: 'white'}}/>} buttonColor={Color.color.AccentColor}/>
      </HeaderView>
    );
  }
}

JobPointsView.propTypes = {
  enterprise: PropTypes.object,
  month: PropTypes.shape({
    month: PropTypes.any,
    year: PropTypes.any
  }),
  navigator: PropTypes.any.isRequired,
  points: PropTypes.object
};

JobPointsView.defaultProps = {
  enterprise: {
    employees: []
  },
  month: {
    month: '',
    year: ''
  },
  user: {
    id: null
  }
}

JobPointsView.contextTypes = {
  onEditPress: PropTypes.func,
  onViewPress: PropTypes.func,
  onLocationPress: PropTypes.func,
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

export default JobPointsView;
