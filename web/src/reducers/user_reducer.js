const initialState = {
  websocketSession: {},
};

const UserReducer = () => (state = initialState, action) => {
  if (action.type === 'WEBSOCKET_SESSION_UPDATED') {
    return Object.assign({}, state, {websocketSession: action.payload});
  }

  return state;
};

export default UserReducer;
