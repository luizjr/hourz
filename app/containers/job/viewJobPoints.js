import React, {
  Component
} from 'react';
import {
  Text,
  ToastAndroid,
  View
} from 'react-native';
import {
  connect
} from 'react-redux';
import moment from 'moment';
import { jobSelector } from '../../reselect/jobs';
import ActButton from '../../components/common/ActButton';
import Color from '../../resource/color';
import getBaseRef from '../../env';
import JobPointsView from '../../components/JobPointsView';
import {setCurrentMonth, cleanCurrentMonth} from '../../actions/currentDate';
import {pointsOfMonthSelector} from '../../reselect/points';

const database = getBaseRef().database();

class ViewJobPoints extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedMonth: {
        month: '',
        year: ''
      },
      points: {}
    }
  }

  componentDidMount() {
    let today = moment();
    let month = {
      month: today.month(),
      year: today.year()
    };
    this.setState({
      selectedMonth: month
    });
    this.props.setCurrentMonth(month);

  }

  componentWillUnmount() {
    this.props.cleanCurrentMonth();
  }

  render() {
    return (
      <View style={{flex:1}}>
        <JobPointsView
          enterprise={this.props.job}
          month={this.state.selectedMonth}
          navigator={this.props.navigator}
          points={this.props.points}
          user={this.props.user}/>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  let job = jobSelector(state, props.route.job);
  return {
    job,
    user: state.user,
    points: pointsOfMonthSelector(state, job)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentMonth: (date) => dispatch(setCurrentMonth(date)),
    cleanCurrentMonth: () => dispatch(cleanCurrentMonth())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewJobPoints);
