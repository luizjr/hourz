import React, { Component } from 'react';
import {
  Text,
  TextInput,
  ToastAndroid,
  ToolbarAndroid,
  View
} from 'react-native';
import Reactotron from 'reactotron';

import { connect } from 'react-redux';
import ProgressBar from '../../components/common/ProgressBar';
import * as HBStyleSheet from '../../components/common/HBStyleSheet';
import {signUp, resetAuth} from '../../actions/authentication';
import Header from '../../components/common/Header';
import TextButton from '../../components/common/TextButton';
import BackButtonIcon from '../../components/common/BackButtonIcon';
import Color from '../../resource/color';


class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            passwordConfirmation: '',
            errorMessage: '',
            isFetching: false
        };
        this.onPress = this.onPress.bind(this);
    }

    componentDidMount() {
        this.props.resetAuth();
    }

    render() {
      if(this.state.isFetching) {
        return (
          <ProgressBar text={this.props.fetchData.message} />
        )
      }
        return (
            <View style={styles.container}>

              <Header
                style={styles.header}
                title="Cadastro"
                leftItem={{
                  layout: 'icon',
                  title: 'Close',
                  icon: require('../../components/common/BackButtonIcon'),
                  onPress: this.dismiss.bind(this),
                }}>
              </Header>


              <View style={styles.body}>
                <Text style={styles.label}>Nome:</Text>
                <TextInput
                  style={styles.input}
                  value={this.state.name}
                  onChangeText={(text) => this.setState({name: text})} />

                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={styles.input}
                  value={this.state.email}
                  onChangeText={(text) => this.setState({email: text})}
                  placeholder={'email@example.com'} />

                <Text style={styles.label}>Senha:</Text>
                <TextInput
                  secureTextEntry={true}
                  style={styles.input}
                  value={this.state.password}
                  onChangeText={(text) => this.setState({password: text})} />

                <Text style={styles.label}>Confirmar Senha:</Text>
                <TextInput
                  secureTextEntry={true}
                  style={styles.input}
                  value={this.state.passwordConfirmation}
                  onChangeText={(text) => this.setState({passwordConfirmation: text})} />

                <Text style={styles.msgError}>{this.state.errorMessage}</Text>

                <View style={styles.buttonSubmitWrapper}>
                  <TextButton
                    style={styles.buttonSubmit}
                    textStyle={styles.buttonSubmitText}
                    title="CADASTRAR"
                    onPress={this.onPress}
                  />
                </View>

                {/*<Text style={styles.divider}>
                  Ou
                </Text>*/}

                {/* <View style={styles.buttonSignin}>
                  <HaveAccountButton onPress={() => {
                  this.props.resetAuth();
                  this.props.navigator.pop();
                  }}/>
                </View> */}

              </View>

            </View>
        )
    }

    onPress() {
      if (this.state.password !== this.state.passwordConfirmation) {
          return this.setState({errorMessage: 'Senha não confere!'});
      }
      this.props.signUp(this.state);
    }
    componentDidUpdate(prevProps, prevState) {
      if(this.props.user.isLoggedIn) {
        this.props.navigator.immediatelyResetRouteStack([{name: 'home'}]);
      }
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.user.isRegistered) {
        ToastAndroid.show('Cadastrado com sucesso!', ToastAndroid.SHORT)
        this.props.navigator.pop();
      }
      if(nextProps.user.error) {
        this.setState({
          errorMessage: nextProps.user.error
        });
      }
      this.setState({
        isFetching: nextProps.fetchData.isFetching
      });
    }

    dismiss() {
      this.props.resetAuth();
      this.props.navigator.pop();
    }
  }

function mapStateToProps(state) {
  return {
    fetchData: state.fetchData,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {

  return {
    signUp: (user) => {dispatch(signUp(user))},
    resetAuth: (user) => {dispatch(resetAuth(user))}
  };
}


var styles = HBStyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    android: {
      backgroundColor: Color.color.PrimaryColor,
    },
  },
  title: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  body: {
      flex: 1,
      justifyContent: 'center',
      width: 300,
      alignSelf: 'center'
  },
  input: {
      padding: 4,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      margin: 5,
      alignSelf: 'center'
  },
  label: {
      fontSize: 18,
      alignSelf: 'flex-start',
      marginLeft: 5
  },
  buttonSignin: {
    width: 290
  },
  buttonSubmitWrapper: {
    marginTop: 20,
    width: 290
  },

  buttonSubmit: {
    backgroundColor: 'blue',
    marginTop: 20,
    width: 290
  },
  buttonSubmitText: {
    color: 'white'
  },
  divider: {
    marginTop: 5,
    marginBottom:5,
    alignSelf: 'center'

  },
  toolbar: {
    height: 56,
    backgroundColor: Color.color.PrimaryColor
  },
  msgError: {
    color: 'red',
    fontSize: 15,
    alignSelf: 'center'
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
