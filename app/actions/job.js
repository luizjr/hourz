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
    ThunkAction,
    Enterprise
} from './types'

import moment from 'moment';
import Immutable from 'immutable';
import getBaseRef from '../env';


const database = getBaseRef().database();

function createJobReducer(enterprise: Enterprise): Action {
    return {
        type: 'CREATE_JOB',
        payload: enterprise
    }
}
function editEnterpriseAction(enterprise: Enterprise): Action {
  return {
      type: 'EDIT_JOB',
      payload: enterprise
    }
}

function deleteEnterpriseAction(enterprise: Enterprise): Action {
  return {
      type: 'DELETE_JOB',
      payload: enterprise
    }
}

function renderRow(enterprise: Enterprise): Action {
    return {
        type: 'RENDER_ROW_JOB',
        payload: enterprise
    }
}

export function cleanSaved() {
    return {
        type: 'CLEAN_SAVED'
    }
}

export function jobJoin(token: String, user: Object): ThunkAction {
  return async dispatch => {
    try {
      let enterpriseRef = database.ref('enterprise');
      let enterpriseSearch = await enterpriseRef.orderByChild('token')
        .equalTo(parseInt(token))
        .once('value');
      if (!enterpriseSearch.exists()) {
        ToastAndroid.show('Nenhuma empresa encontrada', ToastAndroid.SHORT);
        throw "Não encontrado";
      }
      let enterprise = null;
      for(let key in enterpriseSearch.val()) {
        enterprise = enterpriseSearch.val()[key];
      }
      if (enterprise.owner === user.id) {
        ToastAndroid.show('Você já é dono desta empresa', ToastAndroid.SHORT);
        throw "dono";
      }
      if (enterprise.users && Object.keys(enterprise.users).indexOf(user.id) > -1) {
        ToastAndroid.show('Você já está vinculado a esta empresa', ToastAndroid.SHORT);
        throw "já incluso";
      }

      try {
        let jobRef = await database.ref(`enterprise/${enterprise.key}/users`)
          .set({
            [user.id]: true
          });

          await database.ref(`profile/${user.id}/jobs`).set({
            [enterprise.key]: true
          });

          dispatch(createJobReducer(enterprise));

      } catch (e) {
        ToastAndroid.show('Salvo com sucesso', ToastAndroid.SHORT);
      } finally {

      }

    } catch (e) {
      console.log('erro: ' + e.message);
    } finally {
      dispatch(finishFetch());
    }

  }
}

export function loadJobs(userId) {
    return async dispatch => {
        try {
            let path = `profile/${userId}/jobs`
            let snapshot = await database.ref(path).once('value');
            if (snapshot.exists()) {
                let jobs = snapshot.val();
                let jobsArray = [];
                for (let key in jobs) {
                    let pathJob = `enterprise/${key}`;
                    let snapshotJob = await database.ref(pathJob).once('value');
                    if (snapshotJob.exists()) {
                        let enterprise = snapshotJob.val();
                        dispatch(createJobReducer(enterprise));
                        //jobsArray.push(jobsEntity);
                    }
                }
                dispatch(renderRow(jobsArray));
                return Promise.resolve('carregado');
            };
        } catch (e) {
            console.log(e.message);
            return Promise.reject(e);
        }
    }

}
