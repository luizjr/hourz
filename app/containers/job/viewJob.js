import React, { Component } from 'react';
import { Clipboard, ToastAndroid, View } from 'react-native';
import JobView from '../../components/JobView';
import {connect} from 'react-redux';
import { jobSelector } from '../../reselect/jobs';
import ActButton from '../../components/common/ActButton';
import Color from '../../resource/color';

class ViewEnterprise extends Component {
  _getActionButton() {
    let actionItems = [
      {
        title: 'Editar empresa',
        iconName: 'edit',
        onPress: () => this.props.navigator.push(
          {
            name: 'edit_job',
            title: 'Editar empresa',
            job: this.props.job,
            type: 'name'
          }
        )
      },
      {
        title: 'Editar ponto',
        iconName: 'place',
        onPress: () => this.props.navigator.push(
          {
            name: 'edit_job',
            title: 'Editar empresa',
            job: this.props.job,
            type: 'point'
          }
        )

      },
      {
        title: 'Copiar token',
        iconName: 'content-copy',
        onPress: () => {
          Clipboard.setString(`${this.props.job.token}`);
          ToastAndroid.show('Copiado para o clipboard', ToastAndroid.SHORT);

        }
      }
    ];
    return (
      <ActButton
        buttonColor={Color.color.AccentColor}
        actionItems={actionItems}
      />
    );
  }

  render() {
    return (
      <View style={{flex:1}}>
        <JobView job={this.props.job} navigator={this.props.navigator}/>
        {this._getActionButton()}
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    job: jobSelector(state, props.route.job)
  };
}

export default connect(mapStateToProps)(ViewEnterprise);
