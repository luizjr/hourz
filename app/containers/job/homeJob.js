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

import PureListView from '../../components/common/PureListView';
import ListContainer from '../../components/common/ListContainer';
import * as HBStyleSheet from '../../components/common/HBStyleSheet';
import {
  connect
} from 'react-redux';
import ActButton from '../../components/common/ActButton';
import Color from '../../resource/color'; //Importa a palheta de cores
import JobList from '../../components/JobList';
import {
  deleteJob
} from '../../actions/job';
import {
  activeJobsSelector
} from '../../reselect/jobs';
import { jobJoin }        from '../../actions/job';
import JobJoinModal       from '../../components/JobJoinModal';
import HeaderView         from '../../components/HeaderView';

class HomeJob extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      jobJoin: false
    };

    this._viewJob = this._viewJob.bind(this);
    this._deleteJob = this._deleteJob.bind(this);
    this._onJobJoinModalClose = this._onJobJoinModalClose.bind(this);
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

  _onJobJoinModalClose(token) {
    console.log(token);
    this.props.jobJoin(token, this.props.user);
    this.setState({jobJoin: false});
  }

  _getActionButton() {
    let title = "Procurar Empresa";
    let iconName = "search";
    let actionItem = {
      buttonColor: '#1abc9c',
      title ,
      iconName,
      onPress: () => this.setState({jobJoin: true})
    }
    return (
      <ActButton
        buttonColor={Color.color.AccentColor}
        actionItems={[actionItem]}
      />
    );
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
      <HeaderView
        title="Meus Trabalhos"
        navigator={this.props.navigator}
      >
        <JobJoinModal
          isVisible={this.state.jobJoin}
          onRequestClose={this._onJobJoinModalClose} />
        <View style={styles.container}>
            <JobList jobs={this.props.jobs} />
        </View>
        {this._getActionButton()}
      </HeaderView>
    );
  }

}

HomeJob.childContextTypes = {
  onViewPress: PropTypes.func,
  onDeletePress: PropTypes.func
}

HomeJob.propTypes = {
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
    jobJoin: (token, user) => dispatch(jobJoin(token, user)),
    deleteJob: (job, userId) => dispatch(deleteJob(job, userId))
  }
}




export default connect(mapStateToProps, mapDispatchToProps)(HomeJob);
