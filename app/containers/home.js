import React, { Component, PropTypes } from 'react';
import {
  Alert,
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
var ImagePickerManager = require('NativeModules').ImagePickerManager;
var geolib = require('geolib');
import RNFetchBlob from 'react-native-fetch-blob';
import ListPoints from './points/listPoints';
import Color from '../resource/color'; //Importa a palheta de cores
import ActButton from '../components/common/ActButton';
import HeaderView from '../components/HeaderView';
import ProgressBar from '../components/common/ProgressBar';
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
import getCurrentPosition from '../misc/getLocation';
import { getTime } from '../resource/timezonedb';
import { defaultOptions, launchCamera } from '../misc/imagePicker';
import getBaseRef from '../env';

const fs = RNFetchBlob.fs;
const Blob = RNFetchBlob.polyfill.Blob;
window.Blob = Blob;
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;

const database = getBaseRef().database();
const storage = getBaseRef().storage().ref();


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

    this.state = {
      pickerModal: {
        isVisible: false
      },
      job: null,
      pointType: null,
      isFetching: false,
      currentDate: moment(),
      myPlace: null,
      ifFetching: false,
      fetchData: '',
      gpsOpen: false
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
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        let myPlace = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.setState({
          myPlace,
          gpsOpen: true
        });
      }, (error) => {
        console.log(error);
        this.setState({
          myPlace: null,
          gpsOpen: false
        });
      }, {enableHighAccuracy: true, timeout: 10000, maximumAge: 5000}
    );
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

    if(
      prevState.pickerModal.isVisible && !this.state.pickerModal.isVisible) {
        if (this.state.job) {
          this._managePoint(this.state.pointType);
        } else {
          ToastAndroid.show("Cancelado.", ToastAndroid.SHORT);
        }
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
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
          this._hitPoint(type, job);
        } else {
          this._hitPoint(type);
        }
        break;
      case 'out':
        this._hitPoint(type, this.props.jobs.find(value => value.key === jobKey));
        break;

    }
  }

  /**
   * bater o ponto
   * @param  {string} type -> 'in' | 'out'
   * @param {string} job -> trabalho selecionado para o ponto
   * @return {void}
   */
  async _hitPoint(pointType, job) {

    this.setState({
      isFetching: true
    });

    try {
      let time = moment();
      let {coords} = await getCurrentPosition();
      console.log(coords);
      // if(!this.state.gpsOpen) {
      //   throw {message: "Erro ao pegar a localização"};
      // }

      // let coords = this.state.myPlace;

      // Verifica se o dispositivo está no raio da empresa
      if(job) {
        if (job.place) {
          let {latitude, longitude, radius, blocked} = job.place;
          if(!geolib.isPointInCircle(coords, job.place, radius)) {
            if (blocked) {
              throw {message: "Você não pode bater o ponto fora da empresa!"};
            }
          }
        }
      }

      let picture = await launchCamera();

      if(picture.didCancel) {
        throw {message: "Cancelado"};
      }

      try {
        // this.setState({fetchData: 'Buscando a hora da rede'});
        // let timezone = await getTime({
        //   latitude: coords.latitude,
        //   longitude: coords.longitude
        // });
        // // converte o timestamp
        // time = moment.unix(timezone.timestamp).add(3, 'hour');


      } catch (e) {
        ToastAndroid.show('Erro ao receber a hora da rede.', ToastAndroid.SHORT);
      } finally {
        // let rnfbURI = RNFetchBlob.wrap(picture.path);
        // this.setState({fetchData: 'Gerando o blob da imagem'});
        // let blob = await Blob.build(rnfbURI, { type : picture.type});
        // let storageRef = storage.child(`points/image.jpg`);
        // this.setState({fetchData: 'Enviando imagem'});
        // let uploadTask = storageRef.put(
        //   blob,
        //   {
        //     contentType: picture.type
        //   }
        // );
        // let snapshot = await uploadTask.then();
        // console.log(snapshot);
        // this.setState({fetchData: 'Salvando os dados'});
        let date = time.format('YYYY/MM/DD');
        let userId = this.props.user.id;
        let hittedPoint = await this.props.hitPoint(
          {pointType, position: coords, picture, date, time, job, userId}
        );
        ToastAndroid.show("Ponto batido.", ToastAndroid.SHORT);
      }

    } catch (e) {
      console.log(e);
      ToastAndroid.show(e.message || e, ToastAndroid.SHORT);
    } finally {
      this.setState({
        job: null,
        pointType: null,
        isFetching: false,
        fetchData: ''
      });
    }
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
      if(this.state.isFetching) {
        return (
          <ProgressBar text={this.state.fetchData} />
        );
      }
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
            {/* <View style={styles.sumContainer}>
              <Text>Total: {this.props.totalHours}</Text>
            </View> */}

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
      user: state.user,
      jobs: jobs
    };
}

function mapDispatchToProps(dispatch) {
  return {
    hitPoint: (
      point
    ) => dispatch(hitPoint(point)),
    loadPoints: (date, userId) => dispatch(loadPoints(date, userId)),
    setCurrentDate: (date) => dispatch(setCurrentDate(date))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
