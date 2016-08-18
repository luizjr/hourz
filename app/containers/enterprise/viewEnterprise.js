import React, {
  Component
} from 'react';
import {
  Clipboard,
  ToastAndroid,
  View
} from 'react-native';
import EnterpriseView from '../../components/EnterpriseView';
import {
  connect
} from 'react-redux';
import {
  enterpriseSelector
} from '../../reselect/enterprises';
import {
  addEmployee, removeEmployee
} from '../../actions/enterprise';
import ActButton from '../../components/common/ActButton';
import Color from '../../resource/color';
import getBaseRef from '../../env';

const database = getBaseRef().database();

class ViewEnterprise extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    this.userRefList = {};
    let enterpriseUsersPath = `enterprise/${this.props.enterprise.key}/users`;
    this.enterpriseUsersRef = database.ref(enterpriseUsersPath);
    this.onChildAdded = this.enterpriseUsersRef.on(
      'child_added',
      (snapshot) => {
        let key = snapshot.key;
        let user = snapshot.val();
        let userRef = database.ref(`profile/${key}`);
        this.userRefList = {
          ...this.userRefList,
          [key]: {
            ref: userRef,
            onChange: userRef.on('value', userSnap => {
              this.props.addEmployee({
                enterprise: this.props.enterprise,
                user: userSnap.val(),
                key: userSnap.key
              });
              console.log(userSnap.val());
            })
          }
        };

      }
    );
    this.onChildRemoved = this.enterpriseUsersRef.on(
      'child_removed',
      (snapshot) => {
        let key = snapshot.key;
        let user = snapshot.val();
        this.props.removeEmployee({
          enterprise: this.props.enterprise,
          key
        });
        this.userRefList[key].ref.off('value', this.userRefList[key].onChange);
        delete this.userRefList[key];
        //let userRef = database.ref(`profile/${key}`);


      }
    );

  }

  componentWillUnmount() {
    this.enterpriseUsersRef.off('child_added', this.onChildAdded);
    this.enterpriseUsersRef.off('child_removed', this.onChildRemoved);
    for (let key in this.userRefList) {
      this.userRefList[key].ref.off('value', this.userRefList[key].onChange);
    }
  }
  _getActionButton() {
    let actionItems = [
      {
        title: 'Visualizar registro de horários',
        iconName: 'view-list',
        onPress: () => this.props.navigator.push(
          {
            name: 'view_enterprise_points',
            title: 'Visualizar pontos da empresa',
            enterprise: this.props.enterprise
          }
        )
      },
      {
        title: 'Editar empresa',
        iconName: 'edit',
        onPress: () => this.props.navigator.push(
          {
            name: 'edit_enterprise',
            title: 'Editar empresa',
            enterprise: this.props.enterprise,
            type: 'name'
          }
        )
      },
      {
        title: 'Editar localização',
        iconName: 'place',
        onPress: () => this.props.navigator.push(
          {
            name: 'edit_enterprise',
            title: 'Editar empresa',
            enterprise: this.props.enterprise,
            type: 'point'
          }
        )

      },
      {
        title: 'Copiar token',
        iconName: 'content-copy',
        onPress: () => {
          Clipboard.setString(`${this.props.enterprise.token}`);
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
        <EnterpriseView enterprise={this.props.enterprise} navigator={this.props.navigator}/>
        {this._getActionButton()}
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
  return {
    addEmployee: payload => dispatch(addEmployee(payload)),
    removeEmployee: payload => dispatch(removeEmployee(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewEnterprise);
