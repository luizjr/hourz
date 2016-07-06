'use strict';

import React, {
  Component
} from 'react';

import {
  View,
  Platform,
  ActionSheetIOS,
  Dimensions,
  Linking,
  Text
} from 'react-native';

import {
  cleanSaved,
  loadEnterprises
} from '../../../actions/enterprise';

import {
  connect
} from 'react-redux';

import * as HBStyleSheet  from '../../../components/common/HBStyleSheet';
import ProgressBar        from '../../../components/common/ProgressBar';
import EnterpriseList     from '../../../components/EnterpriseList';

class MyEnterprise extends Component {

  constructor() {
    super();

    this.state = {
        saved: false,
        isFetching: false,
        user: null
    };

  }

  componentWillMount() {
    this.props.cleanSaved();
  }

  componentDidMount() {
    // Carrega os pontos do dia
    this.setState({
      isFetching: true,
    });
    this.props.loadEnterprises(this.props.user.id);
  }

  componentWillReceiveProps(nextProps) {

    if(nextProps.user.error) {
      this.setState({
        errorMessage: nextProps.user.error
      });
    }
    this.setState({
      isFetching: nextProps.fetchData.isFetching
    });
  }

  render() {

    if(this.state.isFetching) {
      return (
        <View style={styles.container}>
          <ProgressBar style={styles.progress} text={this.props.fetchData.message} />
        </View>
      )
    }

    return (
      <View style={styles.container}>
          {/**   */}
          <EnterpriseList enterprises={this.props.enterprises.enterprises} />
      </View>
    );
  }

}

var styles = HBStyleSheet.create({
  container: {
    height: 486
  }
});

function mapStateToProps(state) {
    return {
      user: state.user,
      enterprises: state.enterpriseReducer,
      fetchData: state.fetchData
    };
}

function mapDispatchToProps(dispatch) {
  return {
    cleanSaved: () => dispatch(cleanSaved()),
    loadEnterprises: (userId) => dispatch(loadEnterprises(userId))
  }
}


module.exports = connect(mapStateToProps, mapDispatchToProps)(MyEnterprise);
