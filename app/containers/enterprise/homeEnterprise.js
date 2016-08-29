'use strict';

import React, {
  Component,
  PropTypes
} from 'react';

import {
  View,
  Alert,
  Platform,
  ActionSheetIOS,
  Dimensions,
  Linking,
  Text
} from 'react-native';

import {
  cleanSaved,
  loadEnterprises,
  deleteEnterprise
} from '../../actions/enterprise';

import {
  connect
} from 'react-redux';

import * as HBStyleSheet  from '../../components/common/HBStyleSheet';
import ProgressBar        from '../../components/common/ProgressBar';
import EnterpriseList     from '../../components/EnterpriseList';
import ActButton          from '../../components/common/ActButton';
import HeaderView         from '../../components/HeaderView';
import Color              from '../../resource/color'; //Importa a palheta de cores

class HomeEnterprise extends Component {

  constructor(props) {
    super(props);

    this.state = {
        saved: false,
        isFetching: false,
        user: null
    };

    this._editEnterprise = this._editEnterprise.bind(this);
    this._viewEnterprise = this._viewEnterprise.bind(this);
    this._deleteEnterprise = this._deleteEnterprise.bind(this);

  }

  /**
   * retorna os valores de context para os componentes filhos
   * @return {Object}
   */
  getChildContext() {
    return {
      onEditPress: this._editEnterprise,
      onViewPress: this._viewEnterprise,
      onDeletePress: this._deleteEnterprise
    }
  }

  _editEnterprise(enterprise) {
    this.props.navigator.push(
      {name: 'edit_enterprise', title: 'Editar empresa', enterprise: enterprise}
    );
  }

  _viewEnterprise(enterprise) {
    this.props.navigator.push(
      {name: 'view_enterprise', title: 'Ver Empresa', enterprise: enterprise}
    );
  }

  _deleteEnterprise(enterprise) {
    Alert.alert(
        'Deletar empresa',
        'Deseja remover esta empresa?', [{
            text: 'Cancelar',
            onPress: () => {},
            style: 'cancel'
        }, {
            text: 'OK',
            onPress: () => {
                this.props.deleteEnterprise(enterprise);
            }
        }
    ]);

  }

  _getActionButton() {
    let title = "Cadastrar Empresa";
    let iconName = "business";
    let type = "enterprise";
    let actionItem = {
      buttonColor: '#1abc9c',
      title ,
      iconName,
      onPress: () => this.props.navigator.push(
        {name: 'new_enterprise', title: 'Empresa nova'}
      )
    }
    return (
      <ActButton
        buttonColor={Color.color.AccentColor}
        actionItems={[actionItem]}
      />
    );
  }

  componentWillMount() {
    this.props.cleanSaved();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isFetching: nextProps.fetchData.isFetching
    });
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
        title="Minhas Empresas"
        navigator={this.props.navigator}
      >
        <View style={styles.container}>
            <EnterpriseList enterprises={this.props.enterprises} />
        </View>
        {this._getActionButton()}
      </HeaderView>
    );
  }

}

HomeEnterprise.childContextTypes = {
  onEditPress: PropTypes.func,
  onViewPress: PropTypes.func,
  onDeletePress: PropTypes.func
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
      enterprises: state.enterpriseReducer.enterprises,
      fetchData: state.fetchData
    };
}

function mapDispatchToProps(dispatch) {
  return {
    cleanSaved: () => dispatch(cleanSaved()),
    loadEnterprises: (userId) => dispatch(loadEnterprises(userId)),
    deleteEnterprise: (enterprise) => dispatch(deleteEnterprise(enterprise))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(HomeEnterprise);
