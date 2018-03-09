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


require('babel-polyfill');
const Bootstrap = require('../bootstrap');
const React = require('react');
const types = React.PropTypes;
const {useStore} = require('p-flux');
const {useRouter} = require('./use_router');
const Router = require('./router');
const Header = require('./header');
const SegmentAnalytics = require('../../vendor/segment-analytics');
const Logger = require('../../helpers/logger');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import SessionWebsocket from './session_websocket';

const muiTheme = getMuiTheme({
  fontFamily: 'Karla'
});

class Application extends React.Component {

  static propTypes = {
    config: types.object.isRequired,
    store: types.object.isRequired,
    router: types.oneOfType([types.object, types.func])
  };

  componentDidMount() {
    injectTapEventPlugin();
    const segment_key = global.Retro.config.segment_key;
    if (global.Retro.config.enable_analytics && segment_key) {
      SegmentAnalytics.load(segment_key);
    }
    Logger.info('Application started');
  }

  render() {
    const {config, store, router} = this.props;
    const {websocket_url} = config;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="retro-application">
          <Header {...{config, ...store}}/>
          <Router {...{router, config, ...store}}/>
          <SessionWebsocket url={websocket_url}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

const EnhancedApplication = useStore(useRouter(Application),
  {
    store: require('../store'),
    actions: [],
    dispatcherHandlers: [
      require('../dispatchers/main_dispatcher'),
      require('../dispatchers/api_dispatcher'),
      require('../dispatchers/analytics_dispatcher')
    ],
    /* eslint-disable no-console */
    onDispatch: (event) => {
      console.info('dispatching event', event);
    }
    /* eslint-enable no-console */
  }
);

Bootstrap.init(EnhancedApplication);

module.exports = EnhancedApplication;
