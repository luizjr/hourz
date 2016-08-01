import React, { Component, PropTypes } from 'react';
import {
  DatePickerAndroid,
  Picker,
  Text,
  TimePickerAndroid,
  ToastAndroid,
  View
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import ptBr from 'moment/locale/pt-br';
import ListPoints from './points/listPoints';
import Color from '../resource/color'; //Importa a palheta de cores
import ActButton from '../components/common/ActButton';
import HeaderView from '../components/HeaderView';
import * as HBStyleSheet from '../components/common/HBStyleSheet';
import DateView from '../components/DateView';
import { hitPoint, loadPoints } from '../actions/point';
import { setCurrentDate } from '../actions/currentDate';
import {
  pointsOfDaySelector,
  totalHoursOfDaySelector,
  pointsWithJobSelector
} from '../reselect/points';
import PickerModal from '../components/common/PickerModal';
// import { b64toBlob } from '../misc/imageWrapper';
var ImagePickerManager = require('NativeModules').ImagePickerManager;


/**
 * Container da tela Home
 */
class Home extends Component {

  /**
   * construtor do componente
   * @param  {any} props
   * @return {void}
   */
  constructor(props) {
    super(props);

    // opções do ImagePickerManager
    this.cameraOptions = {
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Capturar...',
      chooseFromLibraryButtonTitle: 'Buscar na biblioteca...',
      cameraType: 'front',
      aspectX: 1,
      aspectY: 1,
      quality: 0.2,
      angle: 0,
      allowsEditing: true
    };

    this.state = {
      pickerModal: {
        isVisible: false
      },
      job: null,
      pointType: null,
      isFetching: false,
      currentDate: moment()
    };

    // Vincula as funções com o componente
    this._viewPoint = this._viewPoint.bind(this);
    this._onPickerModalClose = this._onPickerModalClose.bind(this);
  }

  /**
   * retorna os valores de context para os componentes filhos
   * @return {Object}
   */
  getChildContext() {
    return { onViewPress: this._viewPoint };
  }

  /**
   * Component Lifecycle Method
   * @return {void}
   */
  componentDidMount() {

    // Altera a data atual no store do redux
    this.props.setCurrentDate(this.state.currentDate.format('YYYY/MM/DD'));

  }


  /**
   * Component Lifecycle Method
   * @param  {any} prevProps -> props antes das alterações
   * @param  {any} prevState -> state antes das alterações
   * @return {void}
   */
  componentDidUpdate(prevProps, prevState) {

    // Se o dia atual foi alterado, carrega os pontos novamente
    if(prevProps.currentDate !== this.props.currentDate) {
       this.props.loadPoints(this.props.currentDate, this.props.user.id);
    }

    if(prevState.pickerModal.isVisible && !this.state.pickerModal.isVisible && this.state.job) {
      console.log('fechado');
      console.log(this.state.job);
      this._managePoint(this.state.pointType);
    }
  }

  _managePoint(type, jobKey=null) {
    this.setState({
      pointType: type
    });
    switch (type) {
      case 'in':
        if(this.props.jobs.length > 0){
          let job = null;
          if(this.props.jobs.length > 1) {
            if (!this.state.job) {
              this.setState({
                pickerModal: {
                  isVisible: true
                }
              });
              return;
            }
            job = this.state.job;
          } else {
            job = this.props.jobs[0];
          }
          console.log('batendo o ponto...');
          this._hitPoint(type, job.key);
        } else {
          this._hitPoint(type);
        }
        break;
        case 'out':
          this._hitPoint(type, jobKey);
          break;

    }
  }

  /**
   * bater o ponto
   * @param  {string} type -> 'in' | 'out'
   * @param {string} job -> trabalho selecionado para o ponto
   * @return {void}
   */
  _hitPoint(type, job) {

    this.setState({
      isFetching: true
    });
    let time = moment();
    // pega a Imagem
    ImagePickerManager.launchCamera(this.cameraOptions, (response)  => {

      // se o usuário cancelou, notifica na tela
      if(response.didCancel) {
        ToastAndroid.show('Cancelado.', ToastAndroid.SHORT);
        this.setState({
          isFetching: false
        });
        return;
      }

      // se deu erro, notifica na tela
      if(response.error) {
        ToastAndroid.show('Erro ao receber a foto', ToastAndroid.SHORT);
        this.setState({
          isFetching: false
        });
        return;
      }
      console.log(this.props);
      // action de bater o Ponto
      // @see app/actions/point.js
      this.props.hitPoint(type, response, job, this.props.user.id);
      this.setState({
        job: null,
        pointType: null
      });
    });
  }

    /**
     * Abre o viewModal para visualizar a imagem do ponto
     * @param  point
     * @return {void}
     */
    _viewPoint(point) {
      this.props.navigator.push({name: 'pointDetail', point: point});
    }

    _onPickerModalClose(job) {
      this.setState({
        pickerModal: {
          isVisible: false
        },
        job: job
      });
    }

    // _onRefresh() {
    //   this.props.loadPoints(this.props.currentDate, this.props.user.id);
    // }

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
    _renderPointList() {
      return (<ListPoints currentDate={this.props.currentDate}/>);
    }

    render() {
      let points = this.props.points;

      let lastPoint = points.slice(-1)[0];
      let pointItem = {
        color: '#1abc9c',
        title: 'Entrada',
        icon: 'keyboard-arrow-right',
        type: 'in'
      };

      // Se o último ponto foi de entrada, altera o botão para saída
      if(lastPoint && lastPoint.pointType === 'in') {
        pointItem = {
          color: '#ff004c',
          title: 'Saída',
          icon: 'keyboard-arrow-left',
          type: 'out',
          job: lastPoint.jobKey
        };
      }

      let actionItem = {
        buttonColor: pointItem.color,
        title: pointItem.title,
        iconName: pointItem.icon,
        onPress: this._managePoint.bind(this, pointItem.type, pointItem.job)
      };
      //
      // let rightItem = {
      //   title: 'Atualizar',
      //   icon: require('../resource/img/refresh@3x.png'),
      //   onPress: this._onRefresh.bind(this)
      // }

      return (
        // <View style={styles.container}>
          <HeaderView
            navigator={this.props.navigator}
            title="Hourz"
            //rightItem={rightItem}
          >
            <PickerModal
              {...this.state.pickerModal}
              items={this.props.jobs.map(
                job => {return {label: job.name, value: job}}
              )}
              title="Selecione a empresa"
              onRequestClose={this._onPickerModalClose} />
            <View style={[styles.clockContainer]}>
              <DateView date={this.state.currentDate} onPress={this._onDatePress.bind(this)}/>
            </View>
            <View style={[styles.pointListContainer]}>
              {this._renderPointList()}
            </View>
            <View style={styles.sumContainer}>
              <Text>Total: {this.props.totalHours}</Text>
            </View>

            {/*Action Button*/}

            <ActButton
              buttonColor={Color.color.AccentColor}
              actionItems={[actionItem]}
            />
          </HeaderView>
        // {/*</View>*/}
      );
    }

    handleShowMenu() {
      this.context.openDrawer();
    }
}


Home.contextTypes = {
  openDrawer: PropTypes.func
};

Home.childContextTypes = {
  onViewPress: PropTypes.func
}

var styles = HBStyleSheet.create({
  container: {
    flex: 1,
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
    let pointsOfDay = pointsOfDaySelector(state);
    let jobs = [
      ...state.enterpriseReducer.enterprises,
      ...state.jobReducer.jobs
    ];
    return {
      currentDate: state.currentDate,
      fetchData: state.fetchData,
      points: pointsWithJobSelector(state, pointsOfDay),
      totalHours: totalHoursOfDaySelector(state),
      user: state.user,
      jobs: jobs
    };
}

function mapDispatchToProps(dispatch) {
  return {
    hitPoint: (pointType, picture, job, userId) => dispatch(hitPoint(pointType, picture, job, userId)),
    loadPoints: (date, userId) => dispatch(loadPoints(date, userId)),
    setCurrentDate: (date) => dispatch(setCurrentDate(date))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
