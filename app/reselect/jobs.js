import { createSelector } from 'reselect';

const jobsSelector = state => state.jobReducer.jobs;
export const activeJobsSelector = createSelector(
  jobsSelector,
  (jobs) => jobs.filter(value => value.active)
);

const jobByPropsSelector = (state, job) => {
  return state.jobReducer.jobs.find(
    (value) => value.key === job.key
  );
};



export const jobSelector = createSelector(
  jobByPropsSelector, job => job
);
