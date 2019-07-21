import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import Retro_reducer from './reducers/retro_reducer';
import MessageReducer from './reducers/message_reducer';
import UserReducer from './reducers/user_reducer';
import ConfigReducer from './reducers/config_reducer';
import ArchiveMiddleware from './middleware/archive_retro_middleware';
import Router_middleware from './middleware/router_middleware';
import Auth_middleware from './middleware/auth_middleware';
import Retro_middleware from './middleware/retro_middleware';
import Analytics_middleware from './middleware/analytics_middleware';
import MessageMiddleware from './middleware/message_middleware';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const getReduxStore = (router, retroClient, analyticsClient) => createStore(combineReducers({
  retro: Retro_reducer(),
  messages: MessageReducer(),
  user: UserReducer(),
  config: ConfigReducer(),
}), composeEnhancers(applyMiddleware(
  ArchiveMiddleware(),
  Analytics_middleware(analyticsClient),
  Router_middleware(router),
  Auth_middleware(window.localStorage),
  Retro_middleware(retroClient),
  MessageMiddleware(),
)));


export default getReduxStore;
