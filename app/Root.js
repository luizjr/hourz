import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Hourz from './Hourz';


/**
 * Componente raiz. Aqui o store do redux é inicializado
 */
class Root extends Component {

  // Construtor
  constructor() {
    super();
    this.state = {
      isLoading: true,
      // store do redux
      store: configureStore(() => this.setState({isLoading: false}))
    };
  }

  /**
   * Renderiza o componente
   * @return {ReactElement}
   */
  render() {
    // Se está carregando, retorna nada
    if(this.state.isLoading) {
      return null;
    }

    return (
      <Provider store={this.state.store}>
        <Hourz />
      </Provider>
    );
  }
}

export default Root;
