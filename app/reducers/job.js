import type {Point, Action} from '../actions/types';
import Immutable from 'immutable';

const initialState = {
  saved: false,
  jobs: []
};



export default function jobReducer(state = initialState, action: Action) {

  // cria um novo state
  let newState = Immutable.fromJS(state);
  let index;

  switch (action.type) {
    case 'RESET_AUTH':
      return initialState;
    case 'CLEAN_SAVED':
      return {
        ...state,
        saved: false
      }

    case 'CREATE_JOB':
      // cria uma nova data e insere a lista com o primeiro ponto do dia
      // return initialState;
      index = newState.get('jobs').findIndex(
        (value) => value.get('key') === action.payload.key
      );

      if(index < 0) {
        return newState
          .set('jobs', newState.get('jobs').push(action.payload))
          .toJS();
      }
      return newState
        .set('jobs', newState.get('jobs').setIn(index, action.payload)).toJS();

    case 'DELETE_JOB':
      return newState.set(
        'jobs',
        newState.get('jobs').delete(
          newState.get('jobs').findIndex(
            (value) => value.get('key') === action.payload.key
          )
        )
      ).toJS();

    case 'EDIT_JOB':
      let payload = Immutable.Map(action.payload);
      index = newState.get('jobs').findIndex(
        (value) => value.get('key') === payload.get('key')
      );
      console.log(newState.set(
        'jobs',
        newState.get('jobs').update(
          index,
          (value) => value.merge(payload)
        )
      ).toJS());
      return newState.set(
        'jobs',
        newState.get('jobs').update(
          index,
          (value) => value.merge(payload)
        )
      ).toJS();

    case 'RENDER_ROW_JOB':
      return newState
        .set('saved',false)
        .toJS();

    default:
      return state;
  }
}
