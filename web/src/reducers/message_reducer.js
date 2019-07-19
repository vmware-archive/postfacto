const initialState = {
  errors: {},
  dialog: null,
  alert: null,
  not_found: {
    retro_not_found: false,
    not_found: false,
    api_server_not_found: false,
  },
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

  if (action.type === 'SET_NOT_FOUND') {
    return Object.assign({}, state, {not_found: action.payload});
  }

  return state;
};

export default MessageReducer;
