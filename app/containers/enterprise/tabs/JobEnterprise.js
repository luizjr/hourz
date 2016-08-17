'use strict';

import React, {
  Component,
  PropTypes
} from 'react';

import {
  Alert,
  View,
  Platform,
  ActionSheetIOS,
  Dimensions,
  Linking,
  Text,
  ToastAndroid
} from 'react-native';

import PureListView from '../../../components/common/PureListView';
import ListContainer from '../../../components/common/ListContainer';
import * as HBStyleSheet from '../../../components/common/HBStyleSheet';
import {
  connect
} from 'react-redux';
import ActButton from '../../../components/common/ActButton';
import Color from '../../../resource/color'; //Importa a palheta de cores
import JobList from '../../../components/JobList';
import {
  deleteJob
} from '../../../actions/job';
import {
  activeJobsSelector
} from '../../../reselect/jobs';

class JobEnterprise extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false
    };

    this._viewJob = this._viewJob.bind(this);
    this._deleteJob = this._deleteJob.bind(this);
  }

  /**
   * retorna os valores de context para os componentes filhos
   * @return {Object}
   */
  getChildContext() {
    return {
      onViewPress: this._viewJob,
      onDeletePress: this._deleteJob
    }
  }

  _viewJob(job) {
    this.props.navigator.push(
      {name: 'view_job', title: 'Ver Empresa', job: job}
    );
  }

  _deleteJob(job) {
    Alert.alert(
        `Desvincular de trabalho`,
        `Deseja sair de ${job.name}?`, [{
            text: 'Cancelar',
            onPress: () => {},
            style: 'cancel'
        }, {
            text: 'OK',
            onPress: async () => {
                let message = '';
                try {
                  let removedJob = await this.props.deleteJob(
                    job, this.props.user.id
                  );
                  message = `${removedJob.name} removido`;
                } catch (e) {
                  message = `Erro ao remover ${job.name}`;
                  console.log(e.message);
                } finally {
                  ToastAndroid.show(message, ToastAndroid.SHORT);
                }
            }
        }
    ]);

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

JobEnterprise.childContextTypes = {
  onViewPress: PropTypes.func,
  onDeletePress: PropTypes.func
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

function mapStateToProps(state) {
    return {
      user: state.user,
      jobs: activeJobsSelector(state),
      fetchData: state.fetchData
    };
}

function mapDispatchToProps(dispatch) {
  return {
    cleanSaved: () => dispatch(cleanSaved()),
    deleteJob: (job, userId) => dispatch(deleteJob(job, userId))
  }
}




export default connect(mapStateToProps, mapDispatchToProps)(JobEnterprise);
