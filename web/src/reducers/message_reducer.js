const initialState = {
  errors: {},
  dialog: null,
  alert: null,
};

const MessageReducer = () => (state = initialState, action) => {
  if (action.type === 'ERRORS_UPDATED') {
    return Object.assign({}, state, {errors: action.payload});
  }

  if (action.type === 'CLEAR_ERRORS') {
    return Object.assign({}, state, {errors: {}});
  }

  if (action.type === 'SHOW_DIALOG') {
    return Object.assign({}, state, {dialog: action.payload});
  }

  if (action.type === 'CLEAR_DIALOG') {
    return Object.assign({}, state, {dialog: null});
  }

  if (action.type === 'SHOW_ALERT') {
    return Object.assign({}, state, {alert: action.payload});
  }

  if (action.type === 'CLEAR_ALERT') {
    return Object.assign({}, state, {alert: null});
  }

  return state;
};

export default MessageReducer;
