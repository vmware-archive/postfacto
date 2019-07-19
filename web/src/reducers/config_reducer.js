const initialState = {
  featureFlags: {
    archiveEmails: false,
  },
  environment: {
    isMobile1030: false,
    isMobile640: false,
  },
};

const ConfigReducer = () => (state = initialState, action) => {
  if (action.type === 'FEATURE_FLAGS_UPDATED') {
    return Object.assign({}, state, {featureFlags: action.payload});
  }

  if (action.type === 'WINDOW_SIZE_UPDATED') {
    return Object.assign({}, state, {environment: action.payload});
  }

  return state;
};

export default ConfigReducer;
