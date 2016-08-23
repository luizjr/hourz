import { ToastAndroid, TimePickerAndroid } from 'react-native';
import moment from 'moment';
import Immutable from 'immutable';
import base64url from "base64url";
import RNFetchBlob from 'react-native-fetch-blob';
import {initFetch, finishFetch} from './fetchData';
import {getTime} from '../resource/timezonedb';
import getBaseRef from '../env';
import type { Action, ImageData, Point, PointType, ThunkAction } from './types';

// depreciado
// const fbase = getBaseRef();

const fs = RNFetchBlob.fs;
const Blob = RNFetchBlob.polyfill.Blob;
window.Blob = Blob;

const database = getBaseRef().database();
const storage = getBaseRef().storage().ref();

const b64toBlob = (b64Data, contentType='', sliceSize=1024) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function registerPoint(point: Point): Action {
  return {
    type: 'REGISTER_POINT',
    payload: point
  }
}

function reportListPoint(points: Array<Point>): Action {
  return {
    type: 'REPORT_LIST_POINT',
    payload: points
  }
}

/**
 * Carrega os pontos de uma determinada data
 * @param  {string} date   [description]
 * @param  {Number} userId [description]
 * @return {void}        [description]
 */
export function loadPoints(date, userId) {
  return async dispatch => {
    // dispatch(initFetch('Carregando seus dados...'));
    try {
      let pointRef = database.ref('points');
      let snapshot = await pointRef
        .orderByChild('userDate')
        .equalTo(`${userId}+${date}`)
        .once("value");
      console.log(snapshot.val());
      if(snapshot.exists()) {
        snapshot.forEach(child => {
          dispatch(registerPoint(child.val()));
        });
      }
      return Promise.resolve('carregado');
    } catch (e) {
      console.log(e.message);
      return Promise.reject(e);
    }
  }

}

// Recupera todos os pontos do usuário
export function loadAllPoints(year,month,userId) {

  return async dispatch => {
    dispatch(initFetch('Carregando seus dados...'));
    try {
      let path = `points/${userId}/${year}/${month}`
      let snapshot = await database.ref(path)
        .once('value');
      if(snapshot.exists()) {
        let points = snapshot.val();
        console.log('points ',points);
        for(let key in points) {
          console.log("points que estao sendo recebidos ");
          console.log(points[key]);
          dispatch(reportListPoint(points[key]));
        }
      };
    } catch (e) {
      console.log(e.message);
    } finally {
      dispatch(finishFetch());
    }
  }

}

export function hitPoint({
  pointType,
  position,
  picture,
  date,
  time,
  job,
  userId
}): ThunkAction {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let {latitude, longitude} = position;
      // firebase
      let pointRef = database.ref('points').push();
      let pointKey = pointRef.key;
      try {
        let base64string = `data:${picture.type};base64,${picture.data}`;
        let storageRef = storage.child(`points/image.jpg`);
        console.log(picture);
        console.log(base64url.fromBase64(picture.data));
        let uploadTask = storageRef.putString(
          base64url.fromBase64(picture.data),
          firebase.storage.StringFormat.BASE64URL,
          {
            contentType: picture.type,
            contentEncoding: 'BASE64'
          }
        );

        let snapshot = await uploadTask.then();
        console.log(snapshot);

        let jobKey = job ? job.key : '';
        let point = {
          key: pointKey,
          pointType,
          location: {latitude, longitude},
          date,
          hour: time.hour(),
          minute: time.minute(),
          createdAt: time.toISOString(),
          picture,
          userId,
          jobKey,
          userDate: `${userId}+${date}`
        };

        let userPath = `profile/${userId}/points/${date}/${pointKey}`
        let userRef = database.ref(userPath);
        let enterprisePath = job ? `enterprise/${jobKey}/points/${date}/${pointKey}` : null;

        // try {
        //   await pointRef.set(point);
        //   await userRef.set(true);
        //   if(enterprisePath) {
        //     enterpriseRef = database.ref(enterprisePath);
        //     await enterpriseRef.set(true);
        //   };
        //   dispatch(registerPoint(point));
        //   resolve(point);
        // } catch (e) {
        //   throw { name: 'FirebaseError', message: 'Erro ao salvar os dados' };
        // }
      } catch (e) {
        console.log(e);
        reject(e.message);
      }
    });
  }
}

export function editPoint(selectedPoint, observation, userId) {
  return async (dispatch, getState) => {
    try {

      // TODO: verificar os pontos anterior e posterior para não alterar
      // fora da range entre um e outro
      // let currentState = Immutable.fromJS(getState().officeHours);
      // let points  = currentState.get(selectedPoint.date).get('points');
      // let index = points.findIndex(point => point.get('key') === selectedPoint.key);
      // let indexBefore = index > 0 ? index - 1 : undefined;
      // let indexAfter = index < points.size -1 ? index + 1 : undefined;
      //
      // let pointBefore = !isNaN(indexBefore) ? points.get(indexBefore).toJS() : null;
      // let pointAfter = !isNaN(indexAfter) ? points.get(indexAfter).toJS() : null;


      // Pega a hora do android
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: selectedPoint.hour,
        minute: selectedPoint.minute,
        is24Hour: true,
      });

      if (action !== TimePickerAndroid.dismissedAction) {

        let time = moment();
        let path = `points/${selectedPoint.key}`;
        let pointRef = database.ref(path);
        let point = {
          ...selectedPoint,
          hour,
          minute,
          edited: true,
          observation,
          updatedAt: time.toISOString()
        };
        try {
          dispatch(initFetch('Salvando os dados...'));
          let error = await pointRef.update(point);
          if (error) {
            throw "Erro ao salvar seu ponto";
          }
          dispatch(registerPoint(point));
          ToastAndroid.show('Ponto Alterado.', ToastAndroid.SHORT);
        } catch (e) {
          ToastAndroid.show('Erro ao salvar os dados.', ToastAndroid.SHORT);
        } finally {
          dispatch(finishFetch());
        }

      } else {
        ToastAndroid.show('Cancelado.', ToastAndroid.SHORT);
      }

    } catch (e) {
      ToastAndroid.show('Erro ao pegar a hora.', ToastAndroid.SHORT);
      console.log(e.message);
    }
  }
}
