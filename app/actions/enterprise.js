'use strict'

import {
    ToastAndroid,
    TimePickerAndroid
} from 'react-native';

import {
    initFetch,
    finishFetch
} from './fetchData';

import {
    getTime
} from '../resource/timezonedb';

import type {
    Action,
    ImageData,
    ThunkAction
} from './types'

import moment     from 'moment';
import Immutable  from 'immutable';
import getBaseRef from '../env';


const fbase = getBaseRef();

function createEnterpriseReducer(enterprise: Enterprise): Action {
    return {
        type: 'CREATE_ENTERPRISE',
        payload: enterprise
    }
}

function renderRow(enterprise: Enterprise): Action {
    return {
        type: 'RENDER_ROW_ENTERPRISE',
        payload: enterprise
    }
}

export function cleanSaved() {
    console.log('chamou o cleanSavedReducer');
    return {
        type: 'CLEAN_SAVED'
    }
}

export function createEnterprise(enterprise: Enterprise): ThunkAction {
    return dispatch => {

        dispatch(initFetch('Criando empresa...'));

                try {
              // firebase
              let path = `enterprise`;
              let enterpriseRef = fbase.child(path).push();

              enterprise.id = enterpriseRef.key();
              enterprise.token = moment().unix();

              let pathProfile = `profile/${enterprise.owner}/enterprises/${enterprise.id}`;
              let userRef = fbase.child(pathProfile);

              enterpriseRef.set(enterprise);
              userRef.set(true);
              dispatch(finishFetch());
              dispatch(createEnterpriseReducer(enterprise));
              ToastAndroid.show('Empresa criada com sucesso.', ToastAndroid.SHORT);
          } catch (e) {
              console.log(e.message);
              ToastAndroid.show('Erro ao criar a empresa.', ToastAndroid.SHORT);
              dispatch(finishFetch());
          } finally {
              dispatch(finishFetch());
          }

    }
}

export function loadEnterprises(userId) {
  return async dispatch => {
    dispatch(initFetch('Carregando seus dados...'));
    try {
      let path = `profile/${userId}/enterprises`
      let snapshot = await fbase.child(path).once('value');
      if(snapshot.exists()) {
        let enterprises = snapshot.val();
        let enterprisesArray = [];
        for(let key in enterprises) {
          let pathEnterprise = `enterprise/${key}`;
          let snapshotEnterprise = await fbase.child(pathEnterprise).once('value');
          if(snapshotEnterprise.exists()) {
            let enterprisesEntity = snapshotEnterprise.val();
            enterprisesArray.push(enterprisesEntity);
          }
        }
        dispatch(renderRow(enterprisesArray));
      };
      dispatch(finishFetch());
    } catch (e) {
      console.log(e.message);
    } finally {
      dispatch(finishFetch());
    }
  }

}
