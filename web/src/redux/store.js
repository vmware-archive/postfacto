import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import RetroReducer from './reducers/retro_reducer';
import MessageReducer from './reducers/message_reducer';
import UserReducer from './reducers/user_reducer';
import ConfigReducer from './reducers/config_reducer';
import ArchiveMiddleware from './middleware/archive_retro_middleware';
import RouterMiddleware from './middleware/router_middleware';
import AuthMiddleware from './middleware/auth_middleware';
import AnalyticsMiddleware from './middleware/analytics_middleware';
import MessageMiddleware from './middleware/message_middleware';
import ApiMiddleware from './middleware/api_middleware';
import LoggingMiddleware from './middleware/logging_middleware';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const getReduxStore = (router, retroClient, analyticsClient) => createStore(combineReducers({
  retro: RetroReducer(),
  messages: MessageReducer(),
  user: UserReducer(),
  config: ConfigReducer(),
}), composeEnhancers(applyMiddleware(
  LoggingMiddleware(),
  ArchiveMiddleware(),
  AnalyticsMiddleware(analyticsClient),
  RouterMiddleware(router),
  AuthMiddleware(window.localStorage),
  MessageMiddleware(),
  ApiMiddleware(retroClient),
)));


export default getReduxStore;
