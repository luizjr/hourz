import { createSelector } from 'reselect';

const enterpriseByPropsSelector = (state, enterprise) => {
  return state.enterpriseReducer.enterprises.find(
    (value) => value.key === enterprise.key
  );
};

export const enterpriseSelector = createSelector(
  enterpriseByPropsSelector, enterprise => enterprise
);
