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
import {useStore} from 'p-flux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {useRouter} from './use_router';
import Router from './router';
import Header from './header';
import Logger from '../helpers/logger';


import SessionWebsocket from './session_websocket';

import rootStore from './store';

import apiDispatcher from '../dispatchers/api_dispatcher';
import mainDispatcher from '../dispatchers/main_dispatcher';
import analyticsDispatcher from '../dispatchers/analytics_dispatcher';

const muiTheme = getMuiTheme({
  fontFamily: 'Karla',
});

class Application extends React.Component {
  static propTypes = {
    config: types.object.isRequired,
    store: types.object.isRequired,
    router: types.oneOfType([types.object, types.func]),
  };

  componentDidMount() {
    Logger.info('Application started');
  }

  render() {
    const {config, store, router} = this.props;
    const {websocket_url} = config;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="retro-application">
          <Header config={config} retro={store.retro}/>
          <Router router={router} config={config} {...store}/>
          <SessionWebsocket url={websocket_url}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default useStore(
  useRouter(Application),
  {
    store: rootStore,
    actions: [],
    dispatcherHandlers: [
      mainDispatcher,
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
