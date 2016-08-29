import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  View
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import DrawerLayout from '../components/common/DrawerLayout';
import MenuItem from '../components/MenuItem';
import ProgressBar from '../components/common/ProgressBar';
import Home from './home';
import Profile from './profile';
import TabsEnterprise from './enterprise/TabsEnterprise';
import HomeEnterprise from './enterprise/homeEnterprise';
import HomeJob from './job/homeJob';
// import Settings from './settings';
// import Report from './report';
import { switchTab } from '../actions/navigation';
import { loadPoints } from '../actions/point';
import { loadJobs } from '../actions/job';
import { loadEnterprises } from '../actions/enterprise';
import { setCurrentDate } from '../actions/currentDate';

/**
 * Componente principal para aplicar o DrawerLayout e os conteúdos do mesmo
 */
class SideMenu extends Component {

  /**
   * Construtor do componente
   * @param  {any} props
   * @return {void}
   */
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      tab: 'home'
    }
    // vincula as funções ao componente
    this.renderNavigationView = this.renderNavigationView.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this._switchTab = this._switchTab.bind(this);
  }

  _switchTab(tab) {
    this.setState({tab});
  }

  /**
   * define os contextos para os componentes filhos
   * @return {Object}
   */
  getChildContext() {
    return {
      openDrawer: this.openDrawer,
    };
  }

  /**
   * Função que abre o Drawer pelo controlador (this.refs.drawer)
   * @return {void}
   */
  openDrawer() {
    this.refs.drawer.openDrawer();
  }

  componentDidMount() {
    this.props.setCurrentDate(moment().format('YYYY/MM/DD'));
    // Carrega os pontos do dia
    this._loadAllData();
    // this.props.loadEnterprises(this.props.user.id);
  }

  async _loadAllData() {
    this.setState({
      isFetching: true
    });
    try {
      this.setState({fetchData: 'Carregando os pontos'});
      await this.props.loadPoints(this.props.currentDate, this.props.user.id);
      this.setState({fetchData: 'Carregando as empresas'});
      await this.props.loadEnterprises(this.props.user.id);
      await this.props.loadJobs(this.props.user.id);
    } catch (e) {
      console.log(e.message);
    } finally {
      this.setState({
        isFetching: false,
        fetchData: ''
      });
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     isFetching: nextProps.fetchData.isFetching
  //   });
  // }

  /**
   * renderiza a "tab" selecionada
   * @return {ReactElement}
   */
  renderView() {
    switch (this.state.tab) {
      case 'home':
        return <Home navigator={this.props.navigator} />
     case 'profile':
        return <Profile navigator={this.props.navigator} />
     case 'enterprise':
       return <HomeEnterprise route={this.props.route} navigator={this.props.navigator} />
     case 'job':
       return <HomeJob navigator={this.props.navigator} />
    //  case 'report':
    //     return <Report navigator={this.props.navigator} />
      // case 'settings':
      //   return <Settings navigator={this.props.navigator} />
      default:
        return <Home navigator={this.props.navigator} />
    }
  }

  /**
   * Função de callback executada quando o componente muda de "tab"
   * @param  {string} tab
   * @return {void}
   */
  onTabSelect(tab) {
    // se a tab mudou, altera a tab
    if (this.state.tab !== tab) {
      // dispara a action
      this._switchTab(tab);
    }
    // fecha o drawer após a ação
    this.refs.drawer.closeDrawer();
  }

  /**
   * Função do menu "Sair", que faz logout do sistema
   * @return {void}
   */
  onExit() {
    Alert.alert(
      'Fazendo logout',
      'Deseja mesmo sair da sua conta?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => this.props.navigator.immediatelyResetRouteStack(
            [{name:'signin'}]
          )
        }
      ]
    )
  }

  /**
   * renderiza a parte interna do Drawer (Menu lateral)
   * @return {ReactElement}
   */
  renderNavigationView() {
    return(
      <View style={styles.drawer}>
        <Image
          style={styles.header}
          source={require('../resource/img/menu_background.jpg')}>
          <Text style={styles.name}>Hourz</Text>
        </Image>

        <MenuItem
          title="Registro de Ponto"
          selected={this.state.tab === 'home'}
          onPress={this.onTabSelect.bind(this, 'home')} />

        <MenuItem
          title="Minhas Empresas"
          icon="business"
          selected={this.state.tab === 'enterprise'}
          onPress={this.onTabSelect.bind(this, 'enterprise')} />

          <MenuItem
            title="Meus Trabalhos"
            icon="work"
            selected={this.state.tab === 'job'}
            onPress={this.onTabSelect.bind(this, 'job')} />

        <MenuItem
          title="Perfil"
          icon="person"
          selected={this.state.tab === 'profile'}
          onPress={this.onTabSelect.bind(this, 'profile')} />

          {/*<MenuItem
            title="Relatórios"
            icon="equalizer"
            selected={this.state.tab === 'report'}
            onPress={this.onTabSelect.bind(this, 'report')} />

          <MenuItem
            title="Configurações"
            icon="settings"
            selected={this.state.tab === 'settings'}
            onPress={this.onTabSelect.bind(this, 'settings')} />*/}

        <MenuItem
          title="Sair"
          icon="exit-to-app"
          onPress={this.onExit.bind(this)} />
      </View>
    );
  }

  /**
   * Renderiza o componente
   * @return {ReactElement}
   */
  render() {
    if(this.state.isFetching) {
      return (
        <View style={styles.container}>
          <ProgressBar style={styles.progress} text={this.state.fetchData} />
        </View>
      )
    }
    return (
      <DrawerLayout
        ref="drawer"
        drawerWidth={290}
        drawerPosition="left"
        renderNavigationView={this.renderNavigationView}>
        {this.renderView()}
      </DrawerLayout>
    );
  }

}

// Contextos filhos do componente
SideMenu.childContextTypes = {
  openDrawer: React.PropTypes.func,
};

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  drawer: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: 'white'
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 18,
    height: 200,
    justifyContent: 'flex-end',
  },
  name: {
    marginTop: 10,
    color: '#666666',
    fontWeight: '800',
    fontSize: 50
  }
});

/**
 * mapeia o state com os props do componente
 * @param  {any} state
 * @return {object}
 */
function mapStateToProps(state) {
  return {
    currentDate: state.currentDate,
    // navigation: state.navigation,
    user: state.user
  }
}

/**
 * Mapeia as actions com os props do component
 * @param  {function} dispatch
 * @return {object}
 */
function mapDispatchToProps(dispatch) {
  return {
    // switchTab: (tab) => dispatch(switchTab(tab)),
    loadPoints: (date, userId) => dispatch(loadPoints(date, userId)),
    loadJobs: (userId) => dispatch(loadJobs(userId)),
    loadEnterprises: (userId) => dispatch(loadEnterprises(userId)),
    setCurrentDate: (date) => dispatch(setCurrentDate(date))
  };
}

// Conecta o componente com o redux e exporta-o
export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
