import type {Point, Action} from '../actions/types';
import Immutable from 'immutable';

const initialState = {
  saved: false,
  enterprises: []
};

function employeesReducer(employees, action) {
  switch (action.type) {
    case 'ADD_EMPLOYEE':
      let user = action.payload.user;
      return employees.set(user.key, user);
    case 'REMOVE_EMPLOYEE':
      return employees.delete(action.payload.key);
    default:
      return employees;
  }
}

export default function enterpriseReducer(state: List = initialState, action: Action) {

  // cria um novo state
  let index, payload, newState = Immutable.fromJS(state);

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
      payload = Immutable.Map(action.payload);
      index = newState.get('enterprises').findIndex(
        (value) => value.get('key') === payload.get('key')
      );
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

    case 'ADD_EMPLOYEE':
    case 'REMOVE_EMPLOYEE':
      index = newState.get('enterprises').findIndex(
        (value) => value.get('key') === action.payload.enterprise.key
      );
      return newState.set(
        'enterprises',
        newState.get('enterprises').update(
          index,
          (value) => value.set(
            'employees', employeesReducer(
              newState.get('enterprises').get(index).get('employees'),
              action
            )
          )
        )
      ).toJS();
    default:
      return state;
  }
}
