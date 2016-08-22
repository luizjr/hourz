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
import {
  enterpriseSelector
} from '../../reselect/enterprises';
import ActButton from '../../components/common/ActButton';
import Color from '../../resource/color';
import getBaseRef from '../../env';
import EnterprisePointsView from '../../components/EnterprisePointsView';

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

    this.enterprisePointsRef = database.ref(
      `enterprise/${this.props.enterprise.key}/points/${today.format('YYYY/MM')}`
    );

    this.onValue = this.enterprisePointsRef.on('value', async snapshot => {
      if(snapshot.exists()) {
        let days = snapshot.val();

        try {
          for(day in days) {
            let points = days[day];
            for (key in points) {
              let pointRef = database.ref(`points/${key}`);
              let pointSnap = await pointRef.once('value');
              this.setState({
                points: {
                  ...this.state.points,
                  [day]: {
                    ...this.state.points[day],
                    [key]: pointSnap.val()
                  }
                }
              });
            }
          }
        } catch (e) {

        } finally {
          console.log(this.state.points);
        }
      }
    });

  }

  componentWillUnmount() {
    this.enterprisePointsRef.off('value', this.onValue);
  }

  render() {
    return (
      <View style={{flex:1}}>
        <EnterprisePointsView
          enterprise={this.props.enterprise}
          month={this.state.selectedMonth}
          navigator={this.props.navigator}
          points={this.state.points}
          user={this.props.user}/>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    enterprise: enterpriseSelector(state, props.route.enterprise),
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewJobPoints);
