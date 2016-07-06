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
    case 'CLEAN_SAVED':
      return {
        ...state,
        saved: false
      }

    case 'CREATE_ENTERPRISE':

      console.log('CREATE_ENTERPRISE');
      console.log(action.payload);
      // pega o token da empresa
      let token = action.payload.token;

      // cria uma nova data e insere a lista com o primeiro ponto do dia
      return newState
        .set('saved',true)
        .set('enterprises', newState.get('enterprises').push(action.payload))
        .toJS();

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
