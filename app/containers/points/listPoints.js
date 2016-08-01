import React, { Component, PropTypes } from 'react';
import {
  Linking,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
  View
} from 'react-native';
import { connect } from 'react-redux';
import {
  pointsOfDaySelector,
  pointsWithJobSelector,
  totalHoursOfDaySelector
} from '../../reselect/points';
import { editPoint, loadPoints } from '../../actions/point';
import PointList from '../../components/PointList';
import PointEditModal from '../../components/PointEditModal';

class ListPoints extends Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      editModal: {
        point: {},
        isVisible: false
      }
    };

    this._viewEditPoint = this._viewEditPoint.bind(this);
    this._linkingLocation = this._linkingLocation.bind(this);
    this._onEditModalClose = this._onEditModalClose.bind(this);
  }

  /**
   * retorna os valores de context para os componentes filhos
   * @return {Object}
   */
  getChildContext() {
    return {
      onEditPress: this._viewEditPoint,
      onLocationPress: this._linkingLocation
    }
  }
  _linkingLocation(point) {
    let {latitude, longitude} = point.location;
    let url = `https://www.google.com/maps/place/${latitude}+${longitude}/@${latitude},${longitude},18z`;
    // console.log(point.location.coords);
    Linking.openURL(url);
  }

  _viewEditPoint(point) {
    this.setState({
      editModal: {
        point: point,
        isVisible: true
      }
    });
  }

  _onEditModalClose(point, observation) {
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

  async _onRefresh() {
    this.setState({refreshing: true});
    try {
      await this.props.loadPoints(this.props.currentDate, this.props.user.id);
      ToastAndroid.show('Atualizado.', ToastAndroid.SHORT);
    } catch (e) {
      ToastAndroid.show('Erro ao atualizar.', ToastAndroid.SHORT);
    } finally {
      this.setState({refreshing: false});
    }
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <PointEditModal
          {...this.state.editModal}
          onRequestClose={this._onEditModalClose}
        />
        <View style={{flex:1}}>
          <PointList
            points={this.props.points}
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}

          />
        </View>
      </View>
    );
  }
}

ListPoints.propTypes = {
  currentDate: PropTypes.string.isRequired
}

ListPoints.childContextTypes = {
  onEditPress: PropTypes.func,
  onLocationPress: PropTypes.func
};

function mapStateToProps(state, props) {
    let pointsOfDay = pointsOfDaySelector(state, props.currentDate);
    return {
      // currentDate: state.currentDate,
      fetchData: state.fetchData,
      points: pointsWithJobSelector(state, pointsOfDay),
      user: state.user
    };
}

function mapDispatchToProps(dispatch) {
  return {
    editPoint: (point, observation, userId) => dispatch(editPoint(point, observation, userId)),
    loadPoints: (date, userId) => dispatch(loadPoints(date, userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPoints);
