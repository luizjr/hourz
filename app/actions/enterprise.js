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

function createEnterpriseReducer(enterprise: Enterprise): Action {
  return {
    type: 'CREATE_ENTERPRISE',
    payload: enterprise
  }
}

function editEnterpriseAction(enterprise: Enterprise): Action {
  return {
    type: 'EDIT_ENTERPRISE',
    payload: enterprise
  }
}

function deleteEnterpriseAction(enterprise: Enterprise): Action {
  return {
    type: 'DELETE_ENTERPRISE',
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
  return {
    type: 'CLEAN_SAVED'
  }
}

export function createEnterprise(enterprise: Enterprise): ThunkAction {
  return async dispatch => {

    dispatch(initFetch('Criando empresa...'));

    try {
      // firebase
      let path = `enterprise`;
      let enterpriseRef = database.ref(path).push();

      enterprise.key = enterpriseRef.key;
      enterprise.token = moment().unix();

      let pathProfile = `profile/${enterprise.owner}/enterprises/${enterprise.key}`;
      let userRef = database.ref(pathProfile);

      let enterpriseErr = await enterpriseRef.set(enterprise);
      if (enterpriseErr) {
        throw "Erro ao salvar no banco";
      }
      let userErr = await userRef.set(true);
      if (userErr) {
        throw "Erro ao salvar a referência do usuário no banco";
      }
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

export function editEnterprise(enterprise: Enterprise): ThunkAction {
  return async dispatch => {
    let path = `enterprise/${enterprise.key}`;
    let enterpriseRef = database.ref(path);
    try {
      console.log(enterprise);
      dispatch(initFetch('Atualizando os dados...'));
      let error = await enterpriseRef.update(enterprise);
      if (error) {
        throw "Erro ao salvar seu ponto";
      }
      dispatch(editEnterpriseAction(enterprise));
      ToastAndroid.show('Empresa Alterada.', ToastAndroid.SHORT);
    } catch (e) {
      ToastAndroid.show('Erro ao salvar os dados.', ToastAndroid.SHORT);
    } finally {
      dispatch(finishFetch());
    }
  };
}

export function deleteEnterprise(enterprise: Enterprise): ThunkAction {
  return async dispatch => {
    let path = `enterprise/${enterprise.key}`;
    let enterpriseRef = database.ref(path);
    try {
      dispatch(initFetch('Removendo os dados...'));
      let error = await enterpriseRef.remove();
      if (error) {
        throw "Erro ao salvar seu ponto";
      }
      dispatch(deleteEnterpriseAction(enterprise));
      ToastAndroid.show('Empresa Removida.', ToastAndroid.SHORT);
    } catch (e) {
      console.log(e.message);
      ToastAndroid.show('Erro ao salvar os dados.', ToastAndroid.SHORT);
    } finally {
      dispatch(finishFetch());
    }
  };
}

export function loadEnterprises(userId) {
  return async dispatch => {
    try {
      let path = `profile/${userId}/enterprises`;
      let snapshot = await database.ref(path).once('value');
      if (snapshot.exists()) {
        let enterprises = snapshot.val();
        let enterprisesArray = [];
        for (let key in enterprises) {
          let pathEnterprise = `enterprise/${key}`;
          let snapshotEnterprise = await database.ref(pathEnterprise).once('value');
          if (snapshotEnterprise.exists()) {
            let enterprisesEntity = snapshotEnterprise.val();
            enterprisesEntity.employees = {};
            // dispatch(createEnterpriseReducer(enterprisesEntity));
            //
            // let enterpriseUsersPath = `enterprise/${snapshotEnterprise.key}/users`;
            // let enterpriseUsersRef = database.ref(enterpriseUsersPath);
            // let usersSnapshot = await enterpriseUsersRef.once('value');
            // if(usersSnapshot.exists()) {
            //   let users = snapshot.val();
            //   for (userKey in users) {
            //     let userRef = database.ref(`profile/${userKey}`);
            //     let userSnapshot = await userRef.once('value');
            //     if(userSnapshot.exists()) {
            //       dispatch(addEmployee({
            //         enterprise: enterprisesEntity,
            //         user: userSnapshot.val(),
            //         key: userSnapshot.key
            //       }));
            //     }
            //
            //   }

              // this.userRefList = {
              //   ...this.userRefList,
              //   [key]: {
              //     ref: userRef,
              //     onChange: userRef.on('value', userSnap => {
              //       this.props.addEmployee({
              //         enterprise: this.props.enterprise,
              //         user: userSnap.val(),
              //         key: userSnap.key
              //       });
              //     })
              //   }
              // };
            // }
            // enterprisesEntity.employees = await getEnterpriseUsers(enterprisesEntity);
            enterprisesArray.push(enterprisesEntity);
          }
        }
        dispatch(renderRow(enterprisesArray));
      };
      return Promise.resolve('carregado');
    } catch (e) {
      return Promise.reject(e);
    }
  }

}

function getUsersIterator(users) {
  let usersList = [];
  for (let userKey in users) {
    let userRef = database.ref(`profile/${userKey}`);
    let currentUser = userRef.once('value');
    usersList.push(currentUser);
  }
  return usersList;
}

export function addEmployee({enterprise, user, key}) {
  return {
    type: 'ADD_EMPLOYEE',
    payload: {
      enterprise,
      user: {
        ...user,
        key
      }
    }
  };
}

export function loadEmployees(userid) {
  return dispatch => {

  };
}

export function removeEmployee({enterprise, key}) {
  return {
    type: 'REMOVE_EMPLOYEE',
    payload: {
      enterprise,
      key
    }
  };
}

async function getEnterpriseUsers(enterprise) {
  let userRef = database.ref('profile');
  if (!enterprise.users) {
    return [];
  }
  let userArray = [];
  try {
    console.log(enterprise);
    for (let key in enterprise.users) {
      console.log(key);
      if (enterprise.users[key].active) {
        let user = await userRef.child(`${key}`).orderByChild('name').once('value');
        userArray.push(user.val());
      }
    }
    return Promise.resolve(userArray);
  } catch (e) {
    return Promise.reject(e);
  }

}
