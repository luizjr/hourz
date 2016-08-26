
export function setCurrentDate(date: string) {
  return {
    type: 'SET_CURRENT_DATE',
    payload: date
  };
}

export function setCurrentMonth(date: Object) {
  return {
    type: 'SET_CURRENT_MONTH',
    payload: date
  };
}

export function cleanCurrentMonth() {
  return {
    type: 'CLEAN_CURRENT_MONTH'
  };
}
