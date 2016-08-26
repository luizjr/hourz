const initialState = {}

export default function currentMonth(state = initialState, action) {
  switch (action.type) {
    case 'SET_CURRENT_MONTH':
      return action.payload;
    case 'CLEAN_CURRENT_MONTH':
      return initialState;
    default:
      return state;
  }
}
