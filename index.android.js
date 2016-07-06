import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Root from './app/Root';
import Reactotron from 'reactotron';

Reactotron.connect({enabled: __DEV__})

// Registrando o componente principal da aplicação
AppRegistry.registerComponent('Hourz', ()=> Root);
