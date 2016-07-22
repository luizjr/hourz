import type {Point, Action} from '../actions/types';
import Immutable from 'immutable';

const initialState = {
  saved: false,
  enterprises: []
};



export default function enterpriseReducer(state: List = initialState, action: Action) {

  // cria um novo state
  let newState = Immutable.fromJS(state);

  switch (action.type) {
    case 'RESET_AUTH':
      return initialState;
    case 'CLEAN_SAVED':
      return {
        ...state,
        saved: false
      }

    case 'CREATE_ENTERPRISE':
      // pega o token da empresa
      let token = action.payload.token;

      // cria uma nova data e insere a lista com o primeiro ponto do dia
      return newState
        .set('saved',true)
        .set('enterprises', newState.get('enterprises').push(action.payload))
        .toJS();

    case 'DELETE_ENTERPRISE':
      return newState.set(
        'enterprises',
        newState.get('enterprises').delete(
          newState.get('enterprises').findIndex(
            (value) => value.get('key') === action.payload.key
          )
        )
      ).toJS();

    case 'EDIT_ENTERPRISE':
      let payload = Immutable.Map(action.payload);
      let index = newState.get('enterprises').findIndex(
        (value) => value.get('key') === payload.get('key')
      );
      console.log(newState.set(
        'enterprises',
        newState.get('enterprises').update(
          index,
          (value) => value.merge(payload)
        )
      ).toJS());
      return newState.set(
        'enterprises',
        newState.get('enterprises').update(
          index,
          (value) => value.merge(payload)
        )
      ).toJS();

    case 'RENDER_ROW_ENTERPRISE':
      // cria uma nova data e insere a lista com o primeiro ponto do dia
      return newState
        .set('saved',false)
        .set('enterprises', action.payload)
        .toJS();

    default:
      return state;
  }
}
