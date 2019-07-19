/*
 * Postfacto, a free, open-source and self-hosted retro tool aimed at helping
 * remote teams.
 *
 * Copyright (C) 2016 - Present Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 *
 * it under the terms of the GNU Affero General Public License as
 *
 * published by the Free Software Foundation, either version 3 of the
 *
 * License, or (at your option) any later version.
 *
 *
 *
 * This program is distributed in the hope that it will be useful,
 *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *
 * GNU Affero General Public License for more details.
 *
 *
 *
 * You should have received a copy of the GNU Affero General Public License
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import types from 'prop-types';
import {Actions, useStore} from 'p-flux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Provider} from 'react-redux';
import {applyMiddleware, bindActionCreators, combineReducers, compose, createStore} from 'redux';
import {ConnectedRouter} from './components/router';
import {ConnectedHeader} from './components/shared/header';
import Logger from './helpers/logger';

import SessionWebsocket from './components/session_websocket';

import rootStore from './dispatchers/store';

import apiDispatcher from './dispatchers/api_dispatcher';
import mainDispatcher from './dispatchers/main_dispatcher';
import analyticsDispatcher from './dispatchers/analytics_dispatcher';
import RetroReducer from './reducers/retro-reducer';
import * as ReduxActionDispatcher from './reducers/redux-action-dispatcher';
import MessageReducer from './reducers/message_reducer';
import ArchiveMiddleware from './reducers/archive-retro-middleware';
import UserReducer from './reducers/user_reducer';
import ConfigReducer from './reducers/config_reducer';

const muiTheme = getMuiTheme({
  fontFamily: 'Karla',
});

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reduxStore = createStore(combineReducers({
  retro: RetroReducer(),
  messages: MessageReducer(),
  user: UserReducer(),
  config: ConfigReducer(),
}), composeEnhancers(applyMiddleware(ArchiveMiddleware(Actions))));

const reduxActionDispatcher = bindActionCreators(ReduxActionDispatcher, reduxStore.dispatch);

class Application extends React.Component {
  static propTypes = {
    config: types.object.isRequired,
  };

  componentDidMount() {
    Logger.info('Application started');
    Actions.retrieveConfig();

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    const width = window.innerWidth;
    reduxStore.dispatch({
      type: 'WINDOW_SIZE_UPDATED',
      payload: {
        isMobile640: width < 640,
        isMobile1030: width <= 1030,
      },
    });
  };

  render() {
    const {config} = this.props;
    const {websocket_url} = config;
    return (
      <Provider store={reduxStore}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className="retro-application">

            <ConnectedHeader config={config}/>
            <ConnectedRouter config={config}/>
            <SessionWebsocket url={websocket_url}/>
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default useStore(
  Application,
  {
    store: rootStore,
    actions: [],
    dispatcherHandlers: [
      mainDispatcher(reduxActionDispatcher, reduxStore),
      apiDispatcher,
      analyticsDispatcher,
    ],
    onDispatch: (event) => {
      /* eslint-disable no-console */
      console.info('dispatching event', event);
      /* eslint-enable no-console */
    },
  },
);
