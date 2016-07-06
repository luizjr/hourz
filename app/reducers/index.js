import {combineReducers} from 'redux';
import currentDate from './currentDate';
import fetchData from './fetchData';
import navigation from './navigation';
import officeHours from './point';
import enterpriseReducer from './enterprise';
import user from './user';


const reducers = combineReducers({
  currentDate: currentDate,
  fetchData: fetchData,
  navigation: navigation,
  officeHours: officeHours,
  enterpriseReducer: enterpriseReducer,
  user: user
});

export default reducers;
