import React, {Component, PropTypes} from 'react';
import {
  Animated,
  Dimensions,
  Picker,
  StyleSheet,
  Switch,
  ToastAndroid,
  View,
  Text
} from 'react-native';
import MapView from 'react-native-maps';
import Touchable from './common/Touchable';
import TextButton from './common/TextButton';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { height, width } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.008;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class EnterpriseEditPointView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: -14.235004,
        longitude: -51.92528,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      marker: {
        latitude: -14.235004,
        longitude: -51.92528
      },
      myPlace: {
        latitude: -14.235004,
        longitude: -51.92528
      },
      gpsOpen: false,
      radius: 0,
      blocked: false
    };

    this.onPress = this.onPress.bind(this);
  }


  componentDidMount() {
    if(this.props.enterprise && this.props.enterprise.place) {
      this.setState(
        {
          region: {
            latitude: this.props.enterprise.place.latitude,
            longitude: this.props.enterprise.place.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          },
          marker: {
            latitude: this.props.enterprise.place.latitude,
            longitude: this.props.enterprise.place.longitude
          },
          radius: this.props.enterprise.place.radius,
          blocked: this.props.enterprise.place.blocked
        }
      );
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState(
          {
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            },
            marker: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
          }
        );

      });
    }
    this.watchID = navigator.geolocation.watchPosition((position) => {
      let myPlace = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      this.setState({
        myPlace,
        gpsOpen: true
      });

    });
  }

  _goToCurrentLocal() {
    if(!this.state.gpsOpen) {
      ToastAndroid.show('Ative o GPS Primeiro', ToastAndroid.SHORT);
      return;
    }
    this.setState(
      {
        marker: {
          ...this.state.myPlace
        },

      }
    );
    this.refs.map.animateToRegion({
      ...this.state.myPlace,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onRegionChange(region) {
    this.setState({
      marker: {
        longitude: region.longitude,
        latitude: region.latitude
      }
    });
  }

  _changeRegion() {
    this._goToCurrentLocal();
  }

  onPress() {
    let enterprise = {
      ...this.props.enterprise,
      place: {
        ...this.state.marker,
        radius: this.state.radius,
        blocked: this.state.blocked
      }
    };
    this.props.onSave && this.props.onSave(enterprise);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mapWrapper}>
          <MapView
            ref="map"
            initialRegion={this.state.region}
            style={styles.map}
            onRegionChange={this.onRegionChange.bind(this)}
          >
            <MapView.Marker
              coordinate={this.state.marker}
            />
            <MapView.Circle
              center={this.state.marker}
              radius={this.state.radius}
              strokeWidth={3}
              strokeColor="rgb(242, 21, 37)"
              fillColor="rgba(242, 21, 37, 0.38)"
              />
          </MapView>
          <View style={styles.buttonWrapper}>
            <Touchable onPress={this._changeRegion.bind(this)}>
              <View style={styles.pointButton} >
                <Icon name="gps-fixed" style={styles.buttonIcon}/>
              </View>
            </Touchable>
          </View>
        </View>
        <View style={styles.bodyWrapper}>

          <View style={styles.textWrapper}>
            <Text>Distância Tolerada para Registro do Ponto</Text>
            <Picker
              selectedValue={this.state.radius}
              onValueChange={(val) => this.setState({radius: val})}>
              <Picker.Item label="Qualquer Distância" value={0} />
              <Picker.Item label="15 m" value={15} />
              <Picker.Item label="30 m" value={30} />
              <Picker.Item label="50 m" value={50} />
              <Picker.Item label="100 m" value={100} />
              <Picker.Item label="300 m" value={300} />
            </Picker>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>Permitir bater ponto fora do raio</Text>
              <Switch
                onValueChange={(value) => this.setState({
                  blocked: value
                })}
                style={{marginBottom: 10}}
                value={this.state.blocked} />
            </View>
            <View style={styles.buttonSubmitWrapper}>
              <TextButton
                style={styles.buttonSubmit}
                textStyle={styles.buttonSubmitText}
                title="SALVAR"
                onPress={this.onPress}
              />
            </View>
          </View>
        </View>

        {/*<View style={{flex:1}}>

        </View>*/}
      </View>
    );
  }

  getBodyStyle() {
    var {height, width} = Dimensions.get('window');
  }
}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mapWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch'

    },
    bodyWrapper: {
        height: height/4,
        padding: 5,
        backgroundColor: 'white',
        elevation: 5,
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    pointButton: {
      backgroundColor: 'rgba(83, 83, 83, 0.76)',
      borderRadius: 5,
      alignSelf: 'flex-end',
      margin: 10,
      height: 50,
      width: 50,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonIcon: {
      fontSize: 36,
      color: 'white'
    },
    textWrapper: {
    },
    text: {
        fontSize: 30
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    buttonSubmitWrapper: {
      alignSelf: 'center'
    },
    buttonSubmit: {
      backgroundColor: 'blue',
      marginTop: 20,
      width: 290
    },
    buttonSubmitText: {
      color: 'white'
    }

});

export default EnterpriseEditPointView;
