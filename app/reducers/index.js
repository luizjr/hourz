import {combineReducers} from 'redux';
import currentDate from './currentDate';
import currentMonth from './currentMonth';
import fetchData from './fetchData';
import jobReducer from './job';
import navigation from './navigation';
import officeHours from './point';
import enterpriseReducer from './enterprise';
import user from './user';


const reducers = combineReducers({
  currentDate: currentDate,
  currentMonth: currentMonth,
  fetchData: fetchData,
  jobReducer: jobReducer,
  navigation: navigation,
  officeHours: officeHours,
  enterpriseReducer: enterpriseReducer,
  user: user
});

export default reducers;
