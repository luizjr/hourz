import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image
} from 'react-native';
import ProgressBar from '../../components/common/ProgressBar';
import TextButton from '../../components/common/TextButton';
import { connect } from 'react-redux';
import {signIn, resetAuth} from '../../actions/authentication';

// import BaseRef from '../../base';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isFetching: false
        };
        // this.baseRef = BaseRef;

        this.onPress = this.onPress.bind(this);

    }

    componentDidMount() {
        this.props.resetAuth();
    }

    componentWillReceiveProps(newProps) {
      this.setState({
        isFetching: newProps.fetchData.isFetching
      });
    }

    render() {
        if(this.state.isFetching) {
          return (
            <ProgressBar text={this.props.fetchData.message} />
          )
        }
        return (
            <View style={styles.container}>

              <View style={styles.header}>
                <Image
                  source={require('../../resource/img/clock.png')}
                  style={{width: 150, height: 150}} />
              </View>

              <View style={styles.body}>
                <View style={styles.formContainer}>
                  <Text style={styles.label}>Email:</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      style={styles.input}
                      value={this.state.email}
                      onChangeText={(text) => this.setState({email: text})}
                      keyboardType="email-address"
                    />
                  </View>
                  <Text style={styles.label}>Senha:</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      secureTextEntry={true}
                      style={styles.input}
                      value={this.state.password}
                      onChangeText={(text) => this.setState({password: text})}
                    />
                  </View>

                  <Text style={styles.msgError} >{this.props.user.error}</Text>
                </View>

                <View style={styles.buttonSigninWrapper}>
                  <TextButton
                    style={styles.buttonSignin}
                    textStyle={styles.buttonSigninText}
                    title="ENTRAR"
                    onPress={this.onPress}
                  />
                </View>

                <Text style={styles.divider}>

                </Text>

                <View style={styles.buttonSignupWrapper}>
                  <TextButton
                    style={styles.buttonSignup}
                    textStyle={styles.buttonSignupText}
                    title="NÃO SOU CADASTRADO"

                    onPress={
                      () => {
                        this.props.navigator.push(
                        {name: 'signup', title: 'Registre-se'}
                        );
                      }
                    }
                  />
                </View>

              </View>

            </View>
        )
    }

    onPress() {
        console.log(this.state);
        this.props.signIn(this.state);
    }


    componentDidUpdate(prevProps, prevState) {
      if(this.props.user.isLoggedIn) {
        this.props.navigator.immediatelyResetRouteStack([{name: 'home'}]);
      }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch'
    },
    header: {
      flex: 1,
      justifyContent: 'flex-end'

    },
    body: {
        flex: 1.5,
        justifyContent: 'center',
        width: 300,
        alignItems: 'center'
    },
    formContainer: {
      width: 300,
      flexDirection: 'column',
      alignItems: 'stretch'
    },
    textInputContainer: {

    },
    input: {
        padding: 4,
        height: 40,
        width: 300,
        flex: 1,
        flexDirection: 'row',
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
    buttonSigninWrapper: {
        marginTop: 20,
        width: 290,
        justifyContent: 'flex-start'
    },
    buttonSignin: {
      backgroundColor: 'blue',
      marginTop: 20,
      width: 290
    },
    buttonSigninText: {
      color: 'white'
    },
    buttonSignupWrapper: {
        justifyContent: 'center',
        alignItems: 'stretch',
        width: 290
    },
    buttonSignup: {
      backgroundColor: '#CCC',
      marginTop: 20,
      width: 290
    },
    divider: {
      marginTop: 5,
      marginBottom:5,

    },
    labelHeader: {
      fontSize: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10
    },
    msgError: {
      color: 'red',
      fontSize: 15
    }


});

function mapStateToProps(state) {
  return {
    fetchData: state.fetchData,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {

  return {
    signIn: (user) => {dispatch(signIn(user))},
    resetAuth: ()=> {dispatch(resetAuth())}
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
