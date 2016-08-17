import { createSelector } from 'reselect';
import moment from 'moment';

const officeHoursSelector = state => state.officeHours;
const currentDateSelector = state => state.currentDate;
// const pointsOfDay = (state, currentDate) => {
//   console.log(currentDate);
//   let arr = [];
//   if(state.officeHours[currentDate]){
//     return state.officeHours[currentDate].points;
//   }
//   let days = Object.keys(state.officeHours);
//   for(let i = 0; i < days; i++) {
//     arr = arr.concat(state.officeHours[days[i]]);
//   }
//
//   return arr;
// };
const pointsWithJob = (state, points) => {
  return points.map(point => {
    let jobPoint = state.jobReducer.jobs.find(job => job.key === point.jobKey);
    if(!jobPoint) {
      jobPoint = state.enterpriseReducer.enterprises.find(enterprise => enterprise.key === point.jobKey);
    }
    point.job = jobPoint;
    return point;
  });
};

export const pointsWithJobSelector = createSelector(pointsWithJob, points => points);


const pointByPropsSelector = (state, point) => {
  return state.officeHours
};

export const pointSelector = createSelector();

export const pointsOfDaySelector = createSelector(
  // pointsOfDay, pointsOfDay => pointsOfDay
  officeHoursSelector,
  currentDateSelector,
  (officeHours, currentDate) => {
    let arr = [];
    if(officeHours[currentDate]){
      return officeHours[currentDate].points;
    }
    let days = Object.keys(officeHours);
    for(let i = 0; i < days; i++) {
      arr = arr.concat(officeHours[days[i]]);
    }

    return arr;
  }
);

export const totalHoursOfDaySelector = createSelector(
  pointsOfDaySelector,
  (points) => {
    let total = 0;
    let currentIn = null;

    for(let i = 0; i < points.length; i++) {
      let {pointType, hour, minute} = points[i];
      if(pointType === 'in') {
        currentIn = {hour, minute};
        continue;
      }

      let lastIn = moment({...currentIn});
      let currentOut = moment({hour, minute});
    }
    return total;
  }
);
