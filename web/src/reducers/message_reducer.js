const initialState = {
  errors: {},
};

const MessageReducer = () => (state = initialState, action) => {
  if (action.type === 'ERRORS_UPDATED') {
    return Object.assign({}, state, {errors: action.payload});
  }

  if (action.type === 'CLEAR_ERRORS') {
    return Object.assign({}, state, {errors: {}});
  }

  return state;
};

export default MessageReducer;
