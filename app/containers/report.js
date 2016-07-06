import React, { Component, PropTypes } from 'react';
import {
  Alert,
  DatePickerAndroid,
  Dimensions,
  Linking,
  Modal,
  ProgressBarAndroid,
  Text,
  TimePickerAndroid,
  ToastAndroid,
  View,
  TextInput
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import ptBr from 'moment/locale/pt-br';
import PointSectionList from '../components/PointSectionList';
import Color from '../resource/color'; //Importa a palheta de cores
import ActButton from '../components/common/ActButton';
import Header from '../components/common/Header';
import * as HBStyleSheet from '../components/common/HBStyleSheet';
import DateMonthView from '../components/DateMonthView';
import PointViewModal from '../components/PointViewModal';
import PointEditModal from '../components/PointEditModal';
import ProgressBar from '../components/common/ProgressBar';
import {editPoint, loadAllPoints, loadPoints} from '../actions/point';
import {setCurrentDate} from '../actions/currentDate';
import {pointsOfDaySelector, totalHoursOfDaySelector} from '../reselect/points';
var ImagePickerManager = require('NativeModules').ImagePickerManager;


/**
 * Container da tela Report
 */
class Report extends Component {

  /**
   * construtor do componente
   * @param  {any} props
   * @return {void}
   */
  constructor(props) {
    super(props);

    this.state = {
        viewModal: {
          point: {},
          isVisible: false,
        },
        editModal: {
          point: {},
          isVisible: false
        },
        user: null,
        isFetching: false,
        currentDate: moment(),
        yearDate: moment().format('YYYY'),
        monthDate: moment().format('MM')
    }

    // Vincula as funções com o componente
    this.onPress = this.onPress.bind(this);
    this._viewPoint = this._viewPoint.bind(this);
    this._viewEditPoint = this._viewEditPoint.bind(this);
    this._linkingLocation = this._linkingLocation.bind(this);
    this._onPointEditModalClose = this._onPointEditModalClose.bind(this);
  }

  /**
   * retorna os valores de context para os componentes filhos
   * @return {Object}
   */
  getChildContext() {
    return {
      onEditPress: this._viewEditPoint,
      onViewPress: this._viewPoint,
      onLocationPress: this._linkingLocation
    }
  }

  /**
   * Component Lifecycle Method
   * @return {void}
   */
  componentDidMount() {

    // Altera a data atual no store do redux
    this.props.setCurrentDate(this.state.currentDate.format('YYYY/MM/DD'));

    // Carrega os pontos do dia
    // this.setState({
    //   isFetching: true,
    // });

    this.props.loadAllPoints(
      this.state.yearDate,
      this.state.monthDate,
      this.props.user.id);
  }

  /**
   * Component Lifecycle Method
   * @param  {any} newProps -> props com as alterações
   * @return {void}
   */
  componentWillReceiveProps(newProps) {
    this.setState({
      isFetching: newProps.fetchData.isFetching
    });
  }

  /**
   * Component Lifecycle Method
   * @param  {any} prevProps -> props antes das alterações
   * @param  {any} prevState -> state antes das alterações
   * @return {void}
   */
  componentDidUpdate(prevProps, prevState) {

    // Se o dia atual foi alterado, carrega os pontos novamente
    if (prevState.yearDate !== this.state.yearDate
      || prevState.monthDate !== this.state.monthDate) {
       this.props.loadAllPoints(
         this.state.yearDate,
         this.state.monthDate,
         this.props.user.id);
    }
  }

    /**
     * Abre o mapa externamente e mostra o local onde o ponto foi batido
     * @param  {Point} point
     * @return {void}
     */
    _linkingLocation(point) {
      let {latitude, longitude} = point.location;
      let url = `https://www.google.com/maps/@${latitude},${longitude},18z`;
      // console.log(point.location.coords);
      Linking.openURL(url);
    }

    /**
     * Abre o viewModal para visualizar a imagem do ponto
     * @param  point
     * @return {void}
     */
    _viewPoint(point) {
      this.props.navigator.push({name: 'pointDetail', point: point});
      // this.setState({
      //   viewModal: {
      //     point: point,
      //     isVisible: true
      //   }
      // });
    }

    _viewEditPoint(point) {
      this.setState({
        editModal: {
          point: point,
          isVisible: true
        }
      });
    }

    _onModalClose() {
      this.setState({
        viewModal: {
          point: {},
          isVisible: false
        }
      });
    }

    _onPointEditModalClose(point, observation) {
      console.log(point);
      this.setState({
        editModal: {
          isVisible: false,
          point: {}
        }
      });
      if(observation) {
        this.props.editPoint(point, observation, this.props.user.id);
      } else {
        ToastAndroid.show('Cancelado.', ToastAndroid.SHORT);
      }
    }

    _onRefresh() {
      this.props.loadAllPoints(
        this.state.yearDate,
        this.state.monthDate,
        this.props.user.id);
    }

    async _onDatePress() {
      try {

        options = {
          date: this.state.currentDate.toDate(),
          maxDate: moment().toDate()
        };

        const {action, year, month, day} = await DatePickerAndroid.open(options);
        if (action !== DatePickerAndroid.dismissedAction) {
          let date = moment({year, month, day});
          this.props.setCurrentDate(date.format('YYYY/MM/DD'));
          this.setState({
            currentDate: date
          });
        }
      } catch (e) {

      }
    }

    render() {
      if(this.state.isFetching) {
        return (
          <ProgressBar text={this.props.fetchData.message} />
        )
      }
      let points = this.props.points;
      console.log('report points ',points);

      let pointItem = {
        color: '#1abc9c',
        title: 'Entrada',
        icon: 'keyboard-arrow-right',
        type: 'in'
      };


        leftItem = {
            title: 'Menu',

            /**
             * Ao passar um numero maior que zero muda
             * o icone indicando que á notificações
             */
            icon: 0
              ? require('../resource/img/hamburger-unread.png')
              : require('../resource/img/hamburger.png'),
            onPress: this.handleShowMenu.bind(this),
          };

          rightItem = {
            title: 'Atualizar',
            icon: require('../resource/img/refresh@3x.png'),
            onPress: this._onRefresh.bind(this)
          }

      return (
        <View style={styles.container}>

          <Header
            style={styles.header}
            title="Reletórios"
            leftItem={leftItem}
            rightItem={rightItem}
          >
          </Header>

          <PointViewModal
            {...this.state.viewModal}
            onRequestClose={this._onModalClose.bind(this)}
          />
          <PointEditModal
            {...this.state.editModal}
            onRequestClose={this._onPointEditModalClose}
          />
        <View style={[styles.containerInput]}>
            {/** < DateMonthView date={this.state.currentDate} onPress={this._onDatePress.bind(this)}/>*/}
            <Text>
              Ano
            </Text>
            <TextInput
               style={{height: 40, borderColor: 'gray', borderWidth: 1}}
               keyboardType="numeric"
               onChangeText={(text) => this.setState({ yearDate: text })}
              value={this.state.yearDate}
             />
             </View>
           <View style={[styles.containerInput]}>
              <Text>
                Mês
              </Text>
              <TextInput
                 style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                 keyboardType="numeric"
                 onChangeText={(text) => this.setState({ monthDate: text })}
                  value={this.state.monthDate}
               />

          </View>
          <View style={[styles.pointListContainer]}>
            <PointSectionList points={points} />
          </View>

        </View>
      );
    }

    borderStylus(color) {
      return {
        borderWidth: 1,
        borderColor: color
      }
    }

    onPress() {
        this.props.navigator.immediatelyResetRouteStack([
            {
                name: 'signin'
            }
        ]);
    }

    handleShowMenu() {
      this.context.openDrawer();
    }
}


Report.contextTypes = {
  openDrawer: PropTypes.func
};

Report.childContextTypes = {
  onEditPress: PropTypes.func,
  onViewPress: PropTypes.func,
  onLocationPress: PropTypes.func
}

var styles = HBStyleSheet.create({
  container: {
    flex: 1,
  },
  containerInput: {
    flex: 1,
    padding: 10
  },
  header: {
    android: {
      backgroundColor: Color.color.PrimaryColor,
    },
  },
  clockContainer: {
    flex: 4
  },
  pointListContainer: {
    flex: 9
  },
  sumContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: "rgb(219, 219, 219)"
  }
});

function mapStateToProps(state) {
    return {
      currentDate: state.currentDate,
      fetchData: state.fetchData,
      points: state.officeHours,
      totalHours: totalHoursOfDaySelector(state),
      user: state.user
    };
}

function mapDispatchToProps(dispatch) {
  return {
    editPoint: (point, observation, userId) => dispatch(editPoint(point, observation, userId)),
    hitPoint: (pointType, picture, userId) => dispatch(hitPoint(pointType, picture, userId)),
    loadAllPoints: (year, month, userId) => dispatch(loadAllPoints(year, month, userId)),
    setCurrentDate: (date) => dispatch(setCurrentDate(date))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Report);
