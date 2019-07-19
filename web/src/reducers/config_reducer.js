const initialState = {
  featureFlags: {
    archiveEmails: false,
  },
};

const ConfigReducer = () => (state = initialState, action) => {
  if (action.type === 'FEATURE_FLAGS_UPDATED') {
    return Object.assign({}, state, {featureFlags: action.payload});
  }

  return state;
};

export default ConfigReducer;
