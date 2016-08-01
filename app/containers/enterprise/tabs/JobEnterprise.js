'use strict';

import React, {
  Component,
  PropTypes
} from 'react';

import {
  View,
  Platform,
  ActionSheetIOS,
  Dimensions,
  Linking,
  Text
} from 'react-native';

import PureListView       from '../../../components/common/PureListView';
import ListContainer      from '../../../components/common/ListContainer';
import * as HBStyleSheet  from '../../../components/common/HBStyleSheet';
import { connect }        from 'react-redux';
import ActButton          from '../../../components/common/ActButton';
import Color              from '../../../resource/color'; //Importa a palheta de cores
import JobList            from '../../../components/JobList';

class JobEnterprise extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false
    };
  }



  render() {

    // if(this.state.isFetching) {
    //   return (
    //     <View style={styles.container}>
    //       <ProgressBar style={styles.progress} text={this.props.fetchData.message} />
    //     </View>
    //   )
    // }

    return (
      <View style={styles.container}>
          <JobList jobs={this.props.jobs} />
      </View>
    );
  }

}

JobEnterprise.propTypes = {
  jobs: PropTypes.array
}

var styles = HBStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
});

export default JobEnterprise;
