const initialState = {
  errors: {},
  dialog: null,
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

  return state;
};

export default MessageReducer;
