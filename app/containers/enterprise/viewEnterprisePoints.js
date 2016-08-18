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
import {
  enterpriseSelector
} from '../../reselect/enterprises';
import ActButton from '../../components/common/ActButton';
import Color from '../../resource/color';
import getBaseRef from '../../env';
import EnterprisePointsView from '../../components/EnterprisePointsView';

const database = getBaseRef().database();

class ViewEnterprisePoints extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <View style={{flex:1}}>
        <EnterprisePointsView enterprise={this.props.enterprise} navigator={this.props.navigator}/>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    enterprise: enterpriseSelector(state, props.route.enterprise)
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewEnterprisePoints);
